import { HitJobFrom_jobtechdev } from "./types/types";

// For aligning the frontend job object with backend job object, WIP 🚧
export const ObjectTransfer_JobFromjobtechdev_To_LocalJobType = (origin:HitJobFrom_jobtechdev) => {
  return {
    description: origin.description.text
  }
}