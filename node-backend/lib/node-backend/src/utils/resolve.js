async function resolve(...args) {
    const promises = args.length === 1 ? args[0] : args;
    // console.log('calling r', promises)
    return (await _recursiveResolve(promises));
}
async function _recursiveResolve(promises) {
    const value = await Promise.resolve(promises);
    if (Array.isArray(value)) {
        return Promise.all(value.map(_recursiveResolve));
    }
    else if (typeof value === "object") {
        const values = {};
        for (const prop in value) {
            values[prop] = await _recursiveResolve(value[prop]);
        }
        // const values = Object.values(value).map(deepResolve);
        return values;
    }
    return value;
}
const res = resolve({
    number: Promise.resolve(5)
});
//# sourceMappingURL=resolve.js.map