import { LoginDto, LoginPayload } from "./models/LoginDto";
import axios from "axios";
import { isAxiosError } from "../../utils/axios";
import { RegisterPayload, RegisterDtoStepOne, RegisterTeacherDto } from "./models/RegisterDto";
import { RefreshTokenDto, RefreshTokenPayload } from "./models/RefreshTokenDto";
import { AuthorizationError } from "../../utils/errorUtils";
import { Singleton } from "../../utils/tsyringe";
import { isNonAnonymousRegister } from "./AuthenticationService";
import { adminDb } from "src/app";
import { Teacher } from "@interfaces/teacher";

// import certificate from "../../../../packages/utils/classquest-2bb7d-b9a69fcf5d24.json";}
export const API_KEY = "AIzaSyDNDx9iWkvP3-uIjEssxkV7FLZbu0NotE8";
@Singleton()
export class AuthenticationHttpAdaptor {
  refreshToken(refreshDto: RefreshTokenDto): Promise<RefreshTokenPayload> {
    return axios
      .post("https://securetoken.googleapis.com/v1/token?key=" + API_KEY, {
        grant_type: "refresh_token",
        refresh_token: refreshDto.refreshToken,
      })
      .catch(catchAxiosError)
      .then((res) => ({
        expiresIn: res.data.expires_in,
        tokenType: res.data.token_type,
        refreshToken: res.data.refresh_token,
        idToken: res.data.id_token,
        userId: res.data.user_id,
        projectId: res.data.project_id,
      }));
  }
  register(registerDto: RegisterDtoStepOne | {} = {}) {
    const register = (() => {
      if (isNonAnonymousRegister(registerDto)) {
        return {
          email: registerDto.email,
          password: registerDto.password,
        };
      }
      return {};
    })();
    return axios
      .post<RegisterPayload>(
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" +
          API_KEY,
        {
          ...register,
          returnSecureToken: true,
        }
      )
      .catch(catchAxiosError)
      .then((res) => res.data);
  }
  async registerBatchTeachers(register: RegisterTeacherDto, user: string) {

    await adminDb.collection("teachers")
          .doc(user)
          .set({
            email: register.email,
            institutions: [],
            nome: register.nome,
            institutionIds: [],
            telefone: register.telefone,
          } as Omit<Teacher, "id">)
  }
  registerAnonymously() {
    return axios
      .post<RegisterPayload>(
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" +
          API_KEY,
        {
          returnSecureToken: true,
        }
      )
      .catch(catchAxiosError)
      .then((res) => res.data);
  }
  
  login(loginDto: LoginDto) {
    return axios
      .post<LoginPayload>(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" +
          API_KEY,
        {
          ...loginDto,
          returnSecureToken: true,
        }
      )
      .catch(catchAxiosError)
      .then((res) => res.data);
  }
}

function catchAxiosError(err: any): never {
  if (isAxiosError(err)) {
    throw new AuthorizationError({
      statusCode: err.response?.data?.error?.code,
      message: err.response?.data?.error?.message,
      name: "Error",
      type: err.response?.data?.error.message.toLowerCase(),
      stack: err.stack,
      details: err.response?.data,
    });
  }
  throw err;
}
