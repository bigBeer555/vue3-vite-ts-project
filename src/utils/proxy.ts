export default function <T extends object>(target:T) : T {
    return new Proxy(target,{
        get(target,propKey) {
            console.log(target,propKey,'target, propKey')
            return Reflect.get(target,propKey)
        },
        set(target,propKey,value) {
            console.log(target,propKey,value,'target, propKey, value')
            return Reflect.set(target,propKey,value)
        }
    })
}