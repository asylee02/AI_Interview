import { CounselingRecord } from 'src/web-push/entities/counselingRecord.entity';
export class ResponseCounselingRecordDto {
  private readonly counselingRecordId: number;

  private readonly comment: string;

  private readonly reservationId: number;

  constructor(
    counselingRecordId: number,
    comment: string,

    reservationId: number,
  ) {
    this.counselingRecordId = counselingRecordId;
    this.comment = comment;

    this.reservationId = reservationId;
  }

  static from(counselingRecord: CounselingRecord): ResponseCounselingRecordDto {
    const Reservation = counselingRecord.reservation.id;

    return new ResponseCounselingRecordDto(
      counselingRecord.id,
      counselingRecord.comment,

      Reservation,
    );
  }
}
