import React from "react";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Cookies from "js-cookie";
import apiMethod, { baseHost } from "../../services/api";
import { Modal } from "@mui/material";
import dayjs from "dayjs";
import clsx from "clsx";
import Swal from "sweetalert2";
import NewsSection from "../../components/NewsSection";



const Home = () => {
  const [news, setNews] = React.useState([]);
  const [trainings, setTrainings] = React.useState([]);
  const [selectedNews, setSelectedNews] = React.useState(null);
  const [selectedTraining, setSelectedTraining] = React.useState(null);
  const [filteredNews, setFilteredNews] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [isLogin, setIsLogin] = React.useState(
    Cookies.get("token") ? true : false
  );
  const [noInduk, setNoInduk] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [open, setOpen] = React.useState(true);
  const [openDetail, setOpenDetail] = React.useState(false);
  const [openTraining, setOpenTraining] = React.useState(false);
  

  const handleOpenDetail = (item, type) => {
    if (type === "training") {
      setSelectedTraining(item);
      setOpenTraining(true);
      return;
    }
    setSelectedNews(item);
    setOpenDetail(true);
  };
  const handleCloseDetail = () => {
    setSelectedNews(null);
    setSelectedTraining(null);
    setOpenDetail(false);
    setOpenTraining(false);
  };
  const handleLogin = async () => {
    try {
      const response = await apiMethod.post("/employee-login", {
        no_induk: noInduk,
        password: password,
      });
      setIsLogin(true);
      setOpen(false);
      Cookies.set("token", response.employee.password, {
        expires: 1,
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response.data.error.message,
      })
    }
  };

  React.useEffect(() => {
    if (isLogin) {
      const getNews = async () => {
        setOpen(false);
        try {
          const response = await apiMethod.get("/articles?populate=*");
          setNews(response.data);
        } catch (error) {
          console.log(error);
        }
      };
      const getTrainings = async () => {
        try {
          const response = await apiMethod.get("/trainings?populate=*");
          setTrainings(response.data);
        } catch (error) {
          console.log(error);
        }
      };
      getTrainings();
      getNews();
    }
  }, [isLogin]);
  React.useEffect(() => {
    if (search) {
      const filtered = news.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredNews(filtered);
    } else {
      setFilteredNews([]);
    }
  }, [search]);

  return (
    <div className="bg-gray-100 min-h-screen font-sans text-gray-800">
      {/* Navbar */}
      <header className="bg-white shadow py-4 sticky top-0 z-10">
        <div className="max-w-[1280px] mx-auto flex justify-between items-center px-4 md:px-8">
          <h1 className="text-xl font-bold">HRD AI</h1>
          <nav className="space-x-6 text-sm font-medium">
            <a href="#" className="hover:text-blue-600">
              Home
            </a>
            <a href="#" className="hover:text-blue-600">
              News
            </a>
            <a href="#" className="hover:text-blue-600">
              Training
            </a>
            <a href="#" className="hover:text-blue-600">
              Ai
            </a>
          </nav>
        </div>
      </header>

      {/* Page Container */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-8">
        {/* Search */}
        <section className="py-10 text-center">
          <h2 className="text-xl font-semibold mb-4">Cari Berita Disini</h2>
          <input
            type="text"
            placeholder="Cari"
            className="px-4 py-2 border rounded w-full shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div
            className={clsx(
              "mt-2 flex flex-col gap-1 bg-gray-200 text-sm py-1",
              { hidden: !filteredNews.length && !search }
            )}
          >
            <div className={clsx("text-lg", { hidden: filteredNews.length })}>
              Berita Tidak Ditemukan
            </div>
            {filteredNews.map((item) => (
              <div
                className="px-4 py-2 text-lg hover:bg-gray-300 cursor-pointer"
                onClick={() => handleOpenDetail(item)}
              >
                {item.title}
              </div>
            ))}
          </div>
        </section>

        {/* News Section */}
        <h2 className="text-lg font-semibold mb-6">Recent News</h2>
        <NewsSection posts={news} onSelectPost={handleOpenDetail} />


        {/* Training Section */}
        <section className="mb-20">
          <h2 className="text-lg font-semibold mb-6">Training</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {trainings.map((item, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl overflow-hidden shadow hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleOpenDetail(item, "training")}
                >
                  {/* Image */}
                  <div className="relative w-full aspect-[16/9] bg-gray-200">
                    <img
                      src={`${baseHost}${item.picture.url}`}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>

                  {/* Text Content */}
                  <div className="p-4">
                    <h4 className="text-base font-semibold text-gray-800 truncate">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Tanggal: {dayjs(item.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                    </p>
                  </div>
                </div>
              ))}
            </div>

        </section>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white text-center py-4 text-sm">
        © 2025 HRD AI. All rights reserved.
      </footer>

      {/* modal login */}
      <Modal
        open={open}
        disableAutoFocus
        sx={{
          "& .MuiBackdrop-root": {
            backdropFilter: "blur(5px)",
          },
        }}
      >
        <div className="bg-white w-[300px] md:w-[360px] p-6 rounded shadow-md absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Login</h2>

          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-1">
              Nomor Induk Pegawai
            </label>
            <input
              type="text"
              value={noInduk}
              onChange={(e) => setNoInduk(e.target.value)}
              className="w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
        </div>
      </Modal>

      {/* modal detail */}
      <Modal open={openDetail} disableAutoFocus>
        <div className="bg-white w-[70%] max-h-[90vh] p-2 overflow-auto rounded shadow-md absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:w-[60%] md:p-6">
          {/* Gambar (jika ada) */}
          {selectedNews?.picture.url && (
            <div className="w-full max-h-[500px] bg-gray-100 flex items-center justify-center overflow-hidden rounded mb-4">
              <img
                src={`${baseHost}${selectedNews.picture.url}`}
                alt={selectedNews.title}
                className="object-contain max-h-[500px] w-auto"
              />
            </div>
          )}

          <h2 className="text-xl font-semibold text-gray-800">
            {selectedNews?.title}
          </h2>
          <p className="text-xs text-gray-700 mb-4 mt-1">
            {dayjs(selectedNews?.createdAt).format("YYYY-MM-DD HH:mm:ss")}
          </p>
          <p className="text-sm text-gray-700">{selectedNews?.description}</p>
          <button
            onClick={handleCloseDetail}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition mt-4"
          >
            Close
          </button>
        </div>
      </Modal>

      {/* modal detail training */}
      <Modal open={openTraining} disableAutoFocus>
        <div className="bg-white w-[70%] max-h-[90vh] p-2 overflow-auto rounded shadow-md absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:w-[60%] md:p-6">
          {/* Gambar (jika ada) */}
          {selectedTraining?.picture.url && (
            <div className="relative w-full aspect-[16/9] rounded overflow-hidden bg-gray-100 mb-4">
              <img
                src={`${baseHost}${selectedTraining.picture.url}`}
                alt={selectedTraining.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          )}

          <h2 className="text-xl font-semibold text-gray-800">
            {selectedTraining?.title}
          </h2>
          <p className="text-xs text-gray-700 mb-4 mt-1">
            {dayjs(selectedTraining?.createdAt).format("YYYY-MM-DD HH:mm:ss")}
          </p>
          <p className="text-sm text-gray-700">
            {selectedTraining?.description}
          </p>
          <button
            onClick={handleCloseDetail}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition mt-4"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Home;
