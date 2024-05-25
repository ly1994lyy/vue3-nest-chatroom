import request from '@/utils/http'

interface ILoginData {
  username: string
  password: string
}

export function loginApi(data: ILoginData) {
  return request({
    method: 'post',
    url: '/auth/login',
    data,
  })
}
