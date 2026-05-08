// import { useAuthStore } from "@/stores/auth-store";

// export async function apiFetch(
//   url: string,
//   options: RequestInit = {}
// ) {
//   const token =
//     useAuthStore.getState().token;

//   return fetch(url, {
//     ...options,

//     headers: {
//       "Content-Type":
//         "application/json",

//       ...options.headers,

//       Authorization: `Bearer ${token}`,
//     },
//   });
// }