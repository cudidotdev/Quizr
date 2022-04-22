export function modifyDraftForDisplay(data: any) {
  if (data.categories) data.categories = data.categories.join(", ");
  return data;
}

export function modifyDraftForSave(data: any) {
  if (data.categories) data.categories = data.categories.split(",");
  return data;
}
