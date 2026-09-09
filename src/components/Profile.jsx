import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { deleteProfilePicture, uploadProfilePicture } from "../api/ApiRequests";
import "../styles/profile.css";
import { Page } from "./Page";
import { getStoredUser } from "../store/local";

const getUserTypeLabel = (userType) => {
  const normalizedType = String(userType ?? "").trim();

  if (normalizedType === "1") return "Comprador";
  if (normalizedType === "2") return "Agencia";
  if (normalizedType === "3") return "Administrador";

  if (normalizedType.toLowerCase() === "comprador") return "Comprador";
  if (normalizedType.toLowerCase() === "agencia") return "Agencia";
  if (normalizedType.toLowerCase() === "administrador") return "Administrador";

  return "Sin tipo";
};

const buildDefaultAvatar = () => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" role="img" aria-label="Avatar genérico de usuario">
      <rect width="200" height="200" rx="100" fill="#fbe8e2"/>
      <circle cx="100" cy="70" r="30" fill="#e66d4c"/>
      <path d="M52 169c10-27 30-41 48-41s38 14 48 41" fill="#bd4e32"/>
      <circle cx="100" cy="60" r="42" fill="none" stroke="#f7d9cd" stroke-width="8" opacity="0.7"/>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [user, setUser] = useState(() => getStoredUser());
  const [selectedImage, setSelectedImage] = useState("");
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const profileImage =
    selectedImage || user?.profile_picture || buildDefaultAvatar();
  const initials =
    (user?.name || user?.email || "Usuario")
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0].toUpperCase())
      .slice(0, 2)
      .join("") || "U";
  const userTypeLabel = getUserTypeLabel(user?.user_type);

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedExtensions = ["jpg", "jpeg", "png"];
    const fileName = file.name.toLowerCase();
    const hasAllowedExtension = allowedExtensions.some((extension) =>
      fileName.endsWith(`.${extension}`),
    );

    if (!hasAllowedExtension) {
      setError("La imagen debe tener extensión .jpg, .jpeg o .png.");
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("La imagen supera el límite de 2 MB. Elegí otra más pequeña.");
      event.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("profile_picture", file);

    setError("");
    setIsUploading(true);

    try {
      const response = await uploadProfilePicture(formData);
      const imageUrl =
        response.data?.profile_picture || URL.createObjectURL(file);
      setSelectedImage(imageUrl);

      const nextUser = {
        ...user,
        profile_picture: imageUrl,
      };

      setUser(nextUser);
      localStorage.setItem("user", JSON.stringify(nextUser));
    } catch (requestError) {
      const message =
        requestError.response?.data?.detail ||
        requestError.response?.data?.error ||
        "No se pudo cargar la foto de perfil.";
      setError(
        typeof message === "string"
          ? message
          : "No se pudo cargar la foto de perfil.",
      );
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const handleDelete = async () => {
    setError("");
    setIsDeleting(true);

    try {
      await deleteProfilePicture();
      setSelectedImage("");
      const nextUser = { ...user, profile_picture: null };
      setUser(nextUser);
      localStorage.setItem("user", JSON.stringify(nextUser));
    } catch (requestError) {
      const message =
        requestError.response?.data?.detail ||
        requestError.response?.data?.error ||
        "No se pudo eliminar la foto de perfil.";
      setError(
        typeof message === "string"
          ? message
          : "No se pudo eliminar la foto de perfil.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Page>
      <section className="profile-shell">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-photo-panel">
              <img
                className="profile-photo"
                src={profileImage}
                alt="Foto de perfil"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = buildDefaultAvatar();
                }}
              />
              <div className="profile-photo-actions">
                <button
                  type="button"
                  className="profile-action primary"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? "Subiendo..." : "Cargar foto"}
                </button>
                <button
                  type="button"
                  className="profile-action secondary"
                  onClick={handleDelete}
                  disabled={
                    isDeleting || (!user?.profile_picture && !selectedImage)
                  }
                >
                  {isDeleting ? "Eliminando..." : "Eliminar"}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                  hidden
                  onChange={handleUpload}
                />
              </div>
            </div>

            <div className="profile-summary">
              <p className="profile-kicker">Perfil</p>
              <h1>{user?.name || "Usuario sin nombre"}</h1>
              <p className="profile-email">
                {user?.email || "Sin email registrado"}
              </p>
            </div>
          </div>

          {error && (
            <div className="profile-error" role="alert">
              {error}
            </div>
          )}

          <div className="profile-grid">
            <article className="profile-info-block">
              <h2>Datos del usuario</h2>
              <div className="profile-detail-row">
                <span>Nombre</span>
                <strong>{user?.name || "No disponible"}</strong>
              </div>
              <div className="profile-detail-row">
                <span>Email</span>
                <strong>{user?.email || "No disponible"}</strong>
              </div>
              <div className="profile-detail-row">
                <span>Tipo</span>
                <strong>{userTypeLabel}</strong>
              </div>
              <div className="profile-detail-row">
                <span>Agencia</span>
                <strong>{user?.agency || "Sin agencia asociada"}</strong>
              </div>
            </article>
          </div>
        </div>
      </section>
    </Page>
  );
};

export default Profile;
