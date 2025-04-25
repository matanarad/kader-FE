export interface Run {
  date: string; // Using ISO string format for dates
  time: number; // Assuming run time is stored as a number (e.g., in seconds)
}
export interface Trainee {
  name: string;
  tag_id: string;
  phone_number: string;
  days_since_last_log: number; // Number of days since last log
  birthday?: Date; // Optional field using TypeScript's optional property syntax
  created_at: Date;
  runs: Run[]; // Array of Run objects
  logs: Date[]; // Array of Date objects
}
