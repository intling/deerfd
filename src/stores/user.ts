import Cookies from 'js-cookie';
import {defineStore } from 'pinia'

const TokenKey = 'loginToken'
function getToken(){
    return Cookies.get(TokenKey)
}
function setToken(token:string){
    return Cookies.set(TokenKey, token)
}
function removeToken(){
    return Cookies.remove(TokenKey)
}

export const TokenStore = defineStore(TokenKey,{
    state:() => ({
        token:getToken()
    }),
    actions:{
        setToken(token:string){
            this.token = token
            setToken(token)
        },
        removeToken(){
            this.token = ''
            removeToken()
        }
    }
})
