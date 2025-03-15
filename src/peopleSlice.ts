// src/features/people/peopleSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define types for the data structure
interface Person {
  id: number;
  name: string;
  arrivalTime: string;
  best2000mRunResult: string;
  runResults: number[];
  runDates: string[];
}

interface PeopleState {
  people: Person[];
}

const initialState: PeopleState = {
  people: [
    {
      id: 1,
      name: "מתן ארד",
      arrivalTime: "08:30 AM",
      best2000mRunResult: "6:30",
      runResults: [8.5, 8.3, 8.7, 8.6, 8.4],
      runDates: [
        "2025-01-01",
        "2025-01-05",
        "2025-01-10",
        "2025-01-15",
        "2025-01-20",
      ],
    },
    {
      id: 2,
      name: "עדן אדלהיט",
      arrivalTime: "09:00 AM",
      best2000mRunResult: "6:10",
      runResults: [7.9, 7.8, 8.0, 7.7, 7.8],
      runDates: [
        "2025-01-02",
        "2025-01-06",
        "2025-01-11",
        "2025-01-16",
        "2025-01-21",
      ],
    },
    {
      id: 2,
      name: "עדן אדלהיט",
      arrivalTime: "09:00 AM",
      best2000mRunResult: "6:10",
      runResults: [7.9, 7.8, 8.0, 7.7, 7.8],
      runDates: [
        "2025-01-02",
        "2025-01-06",
        "2025-01-11",
        "2025-01-16",
        "2025-01-21",
      ],
    },
    {
      id: 2,
      name: "עדן אדלהיט",
      arrivalTime: "09:00 AM",
      best2000mRunResult: "6:10",
      runResults: [7.9, 7.8, 8.0, 7.7, 7.8],
      runDates: [
        "2025-01-02",
        "2025-01-06",
        "2025-01-11",
        "2025-01-16",
        "2025-01-21",
      ],
    },
    {
      id: 2,
      name: "עדן אדלהיט",
      arrivalTime: "09:00 AM",
      best2000mRunResult: "6:10",
      runResults: [7.9, 7.8, 8.0, 7.7, 7.8],
      runDates: [
        "2025-01-02",
        "2025-01-06",
        "2025-01-11",
        "2025-01-16",
        "2025-01-21",
      ],
    },
    {
      id: 2,
      name: "עדן אדלהיט",
      arrivalTime: "09:00 AM",
      best2000mRunResult: "6:10",
      runResults: [7.9, 7.8, 8.0, 7.7, 7.8],
      runDates: [
        "2025-01-02",
        "2025-01-06",
        "2025-01-11",
        "2025-01-16",
        "2025-01-21",
      ],
    },
    {
      id: 2,
      name: "עדן אדלהיט",
      arrivalTime: "09:00 AM",
      best2000mRunResult: "6:10",
      runResults: [7.9, 7.8, 8.0, 7.7, 7.8],
      runDates: [
        "2025-01-02",
        "2025-01-06",
        "2025-01-11",
        "2025-01-16",
        "2025-01-21",
      ],
    },
    {
      id: 2,
      name: "עדן אדלהיט",
      arrivalTime: "09:00 AM",
      best2000mRunResult: "6:10",
      runResults: [7.9, 7.8, 8.0, 7.7, 7.8],
      runDates: [
        "2025-01-02",
        "2025-01-06",
        "2025-01-11",
        "2025-01-16",
        "2025-01-21",
      ],
    },
    {
      id: 2,
      name: "עדן אדלהיט",
      arrivalTime: "09:00 AM",
      best2000mRunResult: "6:10",
      runResults: [7.9, 7.8, 8.0, 7.7, 7.8],
      runDates: [
        "2025-01-02",
        "2025-01-06",
        "2025-01-11",
        "2025-01-16",
        "2025-01-21",
      ],
    },
  ],
};

const peopleSlice = createSlice({
  name: "people",
  initialState,
  reducers: {
    addPerson: (state, action: PayloadAction<Person>) => {
      state.people.push(action.payload);
    },
    updatePerson: (state, action: PayloadAction<Person>) => {
      const index = state.people.findIndex(
        (person) => person.id === action.payload.id
      );
      if (index !== -1) {
        state.people[index] = action.payload;
      }
    },
    removePerson: (state, action: PayloadAction<number>) => {
      state.people = state.people.filter(
        (person) => person.id !== action.payload
      );
    },
  },
});

// Export actions to be used in components
export const { addPerson, updatePerson, removePerson } = peopleSlice.actions;

export default peopleSlice.reducer;
