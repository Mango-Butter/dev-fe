export const isValidStoreId = (
  storeId: number | null | undefined,
): storeId is number => {
  return (
    typeof storeId === "number" &&
    !Number.isNaN(storeId) &&
    Number.isInteger(storeId) &&
    storeId > 0
  );
};
