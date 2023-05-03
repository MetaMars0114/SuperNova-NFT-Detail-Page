export default function useENSName(address?: string): {
  ENSName: string | null;
  loading: boolean;
} {
  return {
    ENSName: null,
    loading: false,
  };
}
