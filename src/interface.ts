// Define types for the data structure
export interface Person {
  id: number;
  name: string;
  arrivalTime: string;
  best2000mRunResult: string;
  runResults: number[];
  runDates: string[];
}
export interface PeopleState {
  people: Person[];
}
