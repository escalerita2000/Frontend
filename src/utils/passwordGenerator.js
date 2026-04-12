

export const generatePassword = ({
  length = 12,
  includeSymbols = true,
  includeNumbers = true,
  includeUppercase = true,
  includeLowercase = true,
}) =>{
  const upper = "ABCDEFGHIJKLMÑOPQRSTUVWXYZ";
  const lower ="abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+\-=\[\]{};':";

  let allchars = "";
  let password = "";

  if (includeUppercase) allchars += upper;
  if (includeLowercase) allchars += lower;
  if (includeNumbers) allchars += numbers;
  if (includeSymbols) allchars += symbols;

  if (allchars.length === 0) return "";

  for (let i = 0; i < length; i++) {
    password += allchars.charAt(Math.floor(Math.random() * allchars.length));
  }

  password = password.split("").sort(() => Math.random() - 0.5).join("");
  return password;
}
