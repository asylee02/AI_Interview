export type headerType = {
  children: React.ReactNode;
};

export type linkedBTNType = {
  href: string;
  children: React.ReactNode;
};

export type BTNType = {
  onClick: () => void;
  children: React.ReactNode;
};

export type CardType = {
  children: React.ReactNode;
};

export type VoidFn = () => void;

export type ReservationCardProps = {
  onTimeSelected: (selectedTime: string) => void;
};
