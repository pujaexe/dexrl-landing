import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { getAffiliateAccount } from "@/services/affiliateService";

/**
 * Returns whether the currently logged-in user is a management admin.
 * Used by widgets to gate admin-only actions (retry, set-failed).
 *
 * isManagement is `true` only when the affiliate row for the logged-in
 * user has `is_management === true`. For unauthenticated visitors,
 * non-affiliate users, or affiliate non-admins it is always `false`.
 */
export const useManagementUser = () => {
  const { userSession } = useAuth();
  const email: string | undefined = userSession?.email;
  const enabled = !!email;

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["affiliate-account", email],
    queryFn: () => getAffiliateAccount(email!),
    enabled,
    staleTime: 60_000,
  });

  // Only consider management when we have a confirmed affiliate row with
  // is_management strictly equal to true. Anything else (null data,
  // loading, undefined flag) is treated as non-admin.
  const isManagement = enabled && data?.is_management === true;

  return {
    isManagement,
    adminEmail: isManagement ? email : undefined,
    // `isLoading` is true on first load; `isFetching` covers refetches.
    // While we don't know yet, treat user as non-admin (caller should
    // not render admin UI until this resolves).
    isResolving: enabled && (isLoading || isFetching) && data === undefined,
  };
};
