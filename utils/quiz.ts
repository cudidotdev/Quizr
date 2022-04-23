export function modifyDraftForDisplay(data: any) {
  if (Array.isArray(data.categories))
    return { ...data, categories: data.categories.join(", ") };
  return data;
}

export function modifyDraftForSave(data: any) {
  if (typeof data.categories === "string")
    return { ...data, categories: data.categories.split(",") };
  return data;
}
