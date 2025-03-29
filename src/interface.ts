export interface Run {
  runDate: string; // Using ISO string format for dates
  runTime: number; // Assuming run time is stored as a number (e.g., in seconds)
}
export interface Trainee {
  name: string;
  tag_id: string;
  phone_number: string;
  birthday?: Date; // Optional field using TypeScript's optional property syntax
  created_at: Date;
  runs: Run[]; // Array of Run objects
  logs: Date[]; // Array of Date objects
}
