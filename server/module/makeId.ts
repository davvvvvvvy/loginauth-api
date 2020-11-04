export function makeId() {
    var res = ''
    var char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    var charLen = char.length
    for ( var i = 0; i < 15; i++ ) { res += char.charAt(Math.floor(Math.random() * charLen)) }
    return res
}