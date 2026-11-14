import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  getPackages,
} from "../api/packages";
import { UNSELECTED, USER_TYPE_MAP } from "../constants";
import { getStoredUser } from "../store/local";

export const useFavorites = ({ withPackageDetails = false } = {}) => {
  const user = getStoredUser();
  const isEndUser = user?.user_type?.toString() === USER_TYPE_MAP.END_USER;

  const [favorites, setFavorites] = useState([]);
  const [favoritePackages, setFavoritePackages] = useState([]);
  const [loading, setLoading] = useState(isEndUser);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [reloadCount, setReloadCount] = useState(0);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!isEndUser) return;

    let ignore = false;

    getFavorites()
      .then(({ data: favData }) => {
        if (ignore) return null;

        const favList = Array.isArray(favData)
          ? favData
          : favData.results || [];
        const sortedFavList = [...favList].sort((a, b) => b.id - a.id);
        setFavorites(sortedFavList);
        setError("");

        if (!withPackageDetails) return null;

        if (sortedFavList.length === 0) {
          setFavoritePackages([]);
          return null;
        }

        return getPackages(UNSELECTED).then(({ data: pkgData }) => {
          if (ignore) return;

          const pkgList = Array.isArray(pkgData)
            ? pkgData
            : pkgData.results || [];
          const packagesById = new Map(pkgList.map((pkg) => [pkg.id, pkg]));

          const enriched = sortedFavList
            .map((fav) => {
              const pkg = packagesById.get(fav.package);
              return pkg ? { ...pkg, favoriteId: fav.id } : null;
            })
            .filter(Boolean);

          setFavoritePackages(enriched);
        });
      })
      .catch((err) => {
        if (!ignore) {
          console.error("Error al cargar favoritos:", err);
          setError("No se pudieron cargar tus favoritos.");
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [isEndUser, withPackageDetails, reloadCount]);

  const reloadFavorites = () => {
    if (!isEndUser) return;
    setLoading(true);
    setReloadCount((prev) => prev + 1);
  };

  const getFavoriteByPackageId = (packageId) =>
    favorites.find((fav) => fav.package === Number(packageId)) || null;

  const toggleFavorite = async (packageId) => {
    if (actionLoading) return;
    setActionLoading(true);

    const existing = getFavoriteByPackageId(packageId);

    try {
      if (existing) {
        await removeFavorite(existing.id);
        setFavorites((prev) => prev.filter((fav) => fav.id !== existing.id));
        setFavoritePackages((prev) =>
          prev.filter((item) => item.favoriteId !== existing.id),
        );
        enqueueSnackbar("Paquete eliminado de favoritos.", { variant: "info" });
      } else {
        const { data } = await addFavorite(Number(packageId));
        setFavorites((prev) => [data, ...prev]);
        enqueueSnackbar("Paquete agregado a favoritos.", {
          variant: "success",
        });
      }
    } catch (err) {
      const serverMessage =
        err.response?.data?.package?.[0] ||
        "Ocurrió un error al actualizar tus favoritos.";
      enqueueSnackbar(serverMessage, { variant: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  const deleteFavoriteById = async (favoriteId) => {
    if (actionLoading) return;
    setActionLoading(true);

    try {
      await removeFavorite(favoriteId);
      setFavorites((prev) => prev.filter((fav) => fav.id !== favoriteId));
      setFavoritePackages((prev) =>
        prev.filter((item) => item.favoriteId !== favoriteId),
      );
      enqueueSnackbar("Paquete eliminado de favoritos.", { variant: "info" });
    } catch {
      enqueueSnackbar("No se pudo eliminar el paquete de favoritos.", {
        variant: "error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  return {
    favorites,
    favoritePackages,
    loading,
    actionLoading,
    error,
    getFavoriteByPackageId,
    toggleFavorite,
    deleteFavoriteById,
    reloadFavorites,
  };
};
