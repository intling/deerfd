/**
 * 错误码常量
 * 错误码规则：
 * 1. 2xx：成功响应
 * 2. 4xx：客户端错误，表示请求参数或者操作有误
 * 3. 5xx：服务端错误，表示服务器处理请求时发生错误
 */

// 成功响应
export const SUCCESS = "200"           // 操作成功
export const CREATED = "201"          // 创建成功
export const ACCEPTED = "202"         // 请求已接受

// 通用客户端错误
export const BAD_REQUEST = "400"      // 错误的请求
export const UNAUTHORIZED = "401"      // 未经授权
export const FORBIDDEN = "403"        // 禁止访问
export const NOT_FOUND = "404"        // 资源未找到
export const METHOD_NOT_ALLOWED = "405" // 方法不允许
export const CONFLICT = "409"         // 资源冲突

// 认证授权错误
export const TOKEN_EXPIRED = "410"    // 令牌过期
export const TOKEN_INVALID = "411"    // 令牌无效
export const TOKEN_MISSING = "412"    // 令牌缺失
export const AUTH_FAILED = "413"      // 认证失败

// 用户相关错误
export const USER_NOT_FOUND = "420"   // 用户不存在
export const USER_EXISTS = "421"      // 用户已存在
export const PASSWORD_ERROR = "422"   // 密码错误
export const ACCOUNT_LOCKED = "423"   // 账户已锁定
export const ACCOUNT_DISABLED = "424" // 账户已禁用
export const EMPLOYEE_ID_EXISTS = "425" // 工号已存在
export const MOBILE_EXISTS = "426"    // 手机号已存在
export const INVALID_PASSWORD = "427" // 当前密码不正确
export const PASSWORD_MISMATCH = "428" // 新密码与确认密码不一致
export const SAME_PASSWORD = "429"    // 新密码不能与当前密码相同

// 文件相关错误
export const FILE_UPLOAD_ERROR = "430"   // 文件上传失败
export const FILE_NOT_FOUND = "431"      // 文件不存在
export const FILE_EXISTS = "432"         // 文件已存在
export const FILE_SIZE_LIMIT = "433"     // 文件大小超限
export const FILE_TYPE_ERROR = "434"     // 文件类型错误
export const FILE_MD5_ERROR = "435"      // 文件MD5校验失败

// 公司相关错误
export const COMPANY_NOT_FOUND = "440"   // 公司不存在
export const COMPANY_EXISTS = "441"      // 公司已存在
export const CREDIT_CODE_ERROR = "442"   // 信用代码错误

// 参数校验错误
export const PARAM_MISSING = "450"       // 参数缺失
export const PARAM_TYPE_ERROR = "451"    // 参数类型错误
export const PARAM_FORMAT_ERROR = "452"  // 参数格式错误
export const PARAM_VALUE_ERROR = "453"   // 参数值错误
export const PARAM_INVALID = "454"       // 参数无效
export const PARAM_TYPE_MISMATCH = "455" // 参数类型不匹配

// 业务逻辑错误
export const BUSINESS_ERROR = "460"      // 业务逻辑错误

// 系统错误
export const INTERNAL_ERROR = "501"      // 内部服务器错误
export const SERVICE_UNAVAILABLE = "503" // 服务不可用
export const INTERNAL_SERVER_ERROR = "500" // 内部服务器错误（兼容HTTP状态码）

// 外部服务错误
export const EXTERNAL_ERROR = "510"      // 外部服务错误
export const DATABASE_ERROR = "511"      // 数据库错误
export const CACHE_ERROR = "512"         // 缓存服务错误
export const OSS_ERROR = "513"           // 对象存储服务错误

// 错误码分类帮助方法
export const isSuccess = (code: string): boolean => {
  return code.startsWith('2')
}

export const isClientError = (code: string): boolean => {
  return code.startsWith('4')
}

export const isServerError = (code: string): boolean => {
  return code.startsWith('5')
}

// 将错误码映射为友好的提示信息
export const getErrorMessage = (code: string, message?: string): string => {
  // 优先使用后端返回的具体错误信息
  if (message) return message
  
  // 错误码映射默认错误消息
  const errorMessages: Record<string, string> = {
    // 通用客户端错误
    [BAD_REQUEST]: '请求参数有误',
    [UNAUTHORIZED]: '请先登录后再操作',
    [FORBIDDEN]: '您没有权限执行此操作',
    [NOT_FOUND]: '请求的资源不存在',
    [METHOD_NOT_ALLOWED]: '请求方法不允许',
    [CONFLICT]: '资源发生冲突',
    
    // 认证授权错误
    [TOKEN_EXPIRED]: '登录已过期，请重新登录',
    [TOKEN_INVALID]: '无效的登录凭证',
    [TOKEN_MISSING]: '请先登录后再操作',
    [AUTH_FAILED]: '身份验证失败',
    
    // 用户相关错误
    [USER_NOT_FOUND]: '用户不存在',
    [USER_EXISTS]: '用户名已被占用',
    [PASSWORD_ERROR]: '密码错误',
    [ACCOUNT_LOCKED]: '账户已被锁定',
    [ACCOUNT_DISABLED]: '账户已被禁用',
    [EMPLOYEE_ID_EXISTS]: '员工工号已存在',
    [MOBILE_EXISTS]: '手机号已被注册',
    [INVALID_PASSWORD]: '当前密码不正确',
    [PASSWORD_MISMATCH]: '两次输入的密码不一致',
    [SAME_PASSWORD]: '新密码不能与当前密码相同',
    
    // 文件相关错误
    [FILE_UPLOAD_ERROR]: '文件上传失败',
    [FILE_NOT_FOUND]: '文件不存在',
    [FILE_EXISTS]: '文件已存在',
    [FILE_SIZE_LIMIT]: '文件大小超出限制',
    [FILE_TYPE_ERROR]: '不支持的文件类型',
    [FILE_MD5_ERROR]: '文件校验失败',
    
    // 系统错误
    [INTERNAL_ERROR]: '系统内部错误',
    [SERVICE_UNAVAILABLE]: '服务暂时不可用',
    [INTERNAL_SERVER_ERROR]: '系统内部错误',
    
    // 默认错误消息
    'default': '操作失败，请稍后再试'
  }
  
  return errorMessages[code] || errorMessages['default']
} 