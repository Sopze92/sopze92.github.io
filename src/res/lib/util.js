
export const _FetchJsonData= async ( path, file )=>{
  const res= await fetch(`${path}/${file}`);
  if(!res.ok) throw new Error(`Error fetching file: ${file}`);
  else return await res.json();
}