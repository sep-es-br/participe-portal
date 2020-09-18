import * as moment from 'moment';

export const howLongAgo = (date: Date) => {
  if (!date || isNaN(date.getTime())) {
    return 'Data Inválida';
  }
  moment.locale('pt-BR');
  return moment(date).fromNow();
};
