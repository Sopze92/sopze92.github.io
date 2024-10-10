
export const _FetchJsonData= async ( path, file )=>{
  try {
    const res= await fetch(`${path}/${file}`);
    if(!res.ok) throw new Error(`IO while reading file: ${file}`);
    else return await res.json();
  }
  catch(e){
    throw new Error(`Couldn't fetch: ${file}`, e);
  }
}