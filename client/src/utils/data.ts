import moment from 'moment'

export function formateDataTime(data: number) {
  return moment(new Date(data)).format('YYYY-MM-DD HH:mm:ss')
}
