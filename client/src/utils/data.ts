import dayjs from 'dayjs'

export function formateDataTime(data: string) {
  return dayjs(data).format('YYYY-MM-DD HH:mm:ss')
}
