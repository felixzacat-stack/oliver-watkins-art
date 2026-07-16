import { createBrowserRouter } from "react-router";
import App from "src/App";

import GalleryPage from "src/pages/GalleryPage";
import PaintingDetailPage from "src/pages/PaintingDetailPage";
import ContactPage from "src/pages/ContactPage";
import CommissionPage from "src/pages/CommissionPage";
import ErrorPage from "src/pages/ErrorPage";
import FrontPage2 from "src/pages/FrontPage2";
import PurchasePage from "src/pages/PurchasePage";
import Gallery3DPage from "src/pages/Gallery3DPage";



export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <FrontPage2 /> },
      { path: "/main", element: <FrontPage2 /> },
      { path: "/gallery", element: <GalleryPage category="all" /> },
      { path: "/gallery/abstract", element: <GalleryPage category="abstract" /> },
      { path: "/gallery/figurative", element: <GalleryPage category="figurative" /> },
      { path: "/gallery/portrait", element: <GalleryPage category="portrait" /> },
      { path: "/gallery/detail/:slug", element: <PaintingDetailPage /> },
      { path: "/3d-gallery", element: <Gallery3DPage /> },
      { path: "/commission", element: <CommissionPage /> },
      { path: "/purchase", element: <PurchasePage /> },
      { path: "/contact", element: <ContactPage /> },
    ]
  },
]);
