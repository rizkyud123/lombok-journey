import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  collection,
  onSnapshot,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  writeBatch
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// In custom database provisioned by AI Studio, pass the databaseId
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export {
  doc,
  collection,
  onSnapshot,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  writeBatch
};
