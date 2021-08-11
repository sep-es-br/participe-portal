import { typeMeetingEnum } from '../enums/TypeMeetingEnum';
import { IChannel } from '../interfaces/IChannel';
import { IConference } from '../interfaces/IConference';
import { ILocality } from '../interfaces/ILocality';

export class Meeting {
    id: number;
    name: string;
    address?: string;
    place?: string;
    localityPlace: ILocality;
    localityCovers?: ILocality[];
    conference: IConference;
    description: string;
    beginDate: string;
    endDate: string;

    typeMeetingEnum: string = String.apply(typeMeetingEnum); // PRESENCIAL || VIRTUAL || PRESENCIAL_VIRTUAL
    channels?: IChannel[];
    linkGoogleMaps?: string;
    linkWaze?: string;
}

export class MeetingPageNumber {
  page: number;
}
