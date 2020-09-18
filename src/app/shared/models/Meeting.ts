import { IConference } from './../interfaces/IConference';
import { ILocality } from './../interfaces/ILocality';

export class Meeting {
    id: number;
    name: string;
    address: string;
    place: string;
    localityPlace: ILocality;
    localityCovers: ILocality[];
    conference: IConference;
    description: string;
    beginDate: Date;
    endDate: Date;
}
