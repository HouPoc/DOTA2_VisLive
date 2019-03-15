import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeStamp2MinSec'
})
export class TimeStamp2MinSecPipe implements PipeTransform {

  transform(timeStamp: number): string {

    timeStamp = Math.max(0, timeStamp);
    const hour = Math.floor(timeStamp / 60);
    let hourString = String(hour);
    const mins = timeStamp % 60;
    let minsString = String(mins);
    if (hour < 10) {
      hourString = '0' + hourString;
    }
    if (mins < 10) {
      minsString = '0' + minsString;
    }

    return hourString + ':' + minsString;
  }

}
