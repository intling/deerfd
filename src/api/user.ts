import axios from "axios";
import * as ErrorCode from "../utils/errorCode";

//获取环境变量中的API路径前缀
const apiPrefix = "/api";

//自定义错误接口
export interface ApiError extends Error {
  code?: string;
  status?: number;
  response?: string | object;
  originalError?: string | object;
}

//创建axios实例
const api = axios.create({
  baseURL: apiPrefix,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

//请求拦截器
api.interceptors.request.use(
  (config) => {
    //从localStorage中获取token
    // const token = getToken()
    // if(token){
    //将token添加到请求头中
    //     config.headers.Authorization = `Bearer ${token}`
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//响应拦截器
api.interceptors.response.use(
  (response) => {
    //根据API文档，返回的数据结构是{code,message,data}
    //http状态码为200，但需要根据code判断业务逻辑是否成功
    if (response.data) {
      const { code, message, data } = response.data;

      //判断错误码类型
      if (code === 200) {
        return data;
      } else {
        //创建自定义错误对象
        const error = new Error(message) as ApiError;
        error.code = code;
        error.response = response;

        // 特殊错误码处理
        if (code === 401 || code === 403 || code === 404) {
          //清除token的相关信息
          window.location.href = "/login";
        }

        return Promise.reject(error);
      }
    }
    //无法解析响应数据的情况
    return Promise.reject(new Error("无效的响应数据格式"));
  },
  (error) => {
    //处理http错误（如网络错误、超时）
    const customError = new Error() as ApiError;
    customError.originalError = error;

    if (error.response) {
      //如果有响应体但HTTP状态码不是200
      const { status } = error.response;

      //特殊处理401响应
      // if(status === 401){
      //     clearToken()//清除Token相关信息
      //     window.location.href = '/login'
      // }

      // 尝试解析响应体
      if (error.response.data) {
        const { code, message } = error.response.data;
        customError.message = ErrorCode.getErrorMessage(code, message);
        customError.code = code;
      } else {
        // 没有响应体，使用HTTP状态码映射
        customError.message = `请求失败 (${status})`;
        customError.status = status;
      }
    }
  }
);

// API 响应结构 这是前后端分离项目中常见的做法，有助于统一处理请求返回的数据格式。
interface RESTResponse<T> {
  code: string;
  message: string | null;
  data: T;
}

//登录接口
interface loginRequest {
  username: string;
  password: string;
  captcha?: string; //验证码可选
}
export interface loginResponse {
  token: string; //登录成功后返回的token
}
export const login = async (params: loginRequest): Promise<loginResponse> => {
  const { ...loginParams } = params;
  const response = await api.post<RESTResponse<loginResponse>>("/login", loginParams);

  // 由于响应拦截器已处理了data字段的提取，这里直接返回response
  return response as unknown as loginResponse;
};

//注册接口
interface registerRequest {
  username: string;
  password: string;
}
export interface registerResponse {
  token: string;
}

export const register = async (params: registerRequest): Promise<registerResponse> => {
  const response = await api.post<RESTResponse<registerResponse>>("/register", params);
  return response as unknown as registerResponse;
};

//保存接口
interface saveRequest {
  nickname: string;
  password: string;
  email: string;
  age: number;
  gender: string;
  bio: string;
}
export interface saveResponse {
  token: string;
}

export const save = async (params: saveRequest): Promise<saveResponse> => {
  const response = await api.post<RESTResponse<saveResponse>>("/save", params);
  return response as unknown as saveResponse;
};
