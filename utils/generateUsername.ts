export function generateUsername(existingUsernamesStr: string): string {
  // Convertir string a array y limpiar espacios
  const existingUsernames = existingUsernamesStr
    .split(",")
    .map((u) => u.trim().toLowerCase())
    .filter((u) => u.length > 0);

  // Adjetivos y animales SIN tildes
  const adjectives = [
    "rapido",
    "feliz",
    "loco",
    "super",
    "tranquilo",
    "genial",
  ];
  const animals = ["tigre", "lobo", "aguila", "leon", "zorro", "oso"];

  let username = "";
  let tries = 0;

  do {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const animal = animals[Math.floor(Math.random() * animals.length)];
    const number = Math.floor(Math.random() * 1000);
    username = `${adj}${animal}${number}`;
    tries++;

    if (tries > 1000) {
      throw new Error("No se pudo generar un nombre único");
    }
  } while (existingUsernames.includes(username));

  return username;
}
