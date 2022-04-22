export async function getFetcher(url: string, headers = {}, options = {}) {
  try {
    const response = await fetch(url, {
      method: "GET",
      credentials: "same-origin",
      headers: { ...headers },
      ...options,
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
}

export async function postFetcher(
  url: string,
  body: any,
  headers = {},
  options = {}
) {
  try {
    const response = await fetch(url, {
      body: JSON.stringify(body),
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      ...options,
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
}

export async function putFetcher(
  url: string,
  body: any,
  headers = {},
  options = {}
) {
  try {
    const response = await fetch(url, {
      body: JSON.stringify(body),
      method: "PUT",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      ...options,
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
}

export async function patchFetcher(
  url: string,
  body: any,
  headers = {},
  options = {}
) {
  try {
    const response = await fetch(url, {
      body: JSON.stringify(body),
      method: "PATCH",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      ...options,
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
}

export async function deleteFetcher(url: string, headers = {}, options = {}) {
  try {
    const response = await fetch(url, {
      method: "DELETE",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      ...options,
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
}

export async function swrGetFetcher(url: string) {
  const response = await fetch(url, { method: "GET" });
  return await response.json();
}
