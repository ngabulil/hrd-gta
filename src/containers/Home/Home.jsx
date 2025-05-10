import React from "react";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Cookies from "js-cookie";
import apiMethod, { baseHost } from "../../services/api";
import { Modal } from "@mui/material";
import dayjs from "dayjs";
import clsx from "clsx";
import Swal from "sweetalert2";

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
      });
    }
  };
  const handleReadMoreNews = (item) => {
    const filterItem = {
      ...item,
      isOpen: true,
    };
    setNews(
      news.map((newsItem) => {
        if (newsItem.id === item.id) {
          return filterItem;
        }
        return newsItem;
      })
    );
  };
  const handleReadMoreTraining = (item) => {
    const filterItem = {
      ...item,
      isOpen: true,
    };
    setTrainings(
      trainings.map((trainingItem) => {
        if (trainingItem.id === item.id) {
          return filterItem;
        }
        return trainingItem;
      })
    );
  };
  const handleCollapseNews = (item) => {
    const filterItem = {
      ...item,
      isOpen: false,
    };
    setNews(
      news.map((newsItem) => {
        if (newsItem.id === item.id) {
          return filterItem;
        }
        return newsItem;
      })
    );
  };
  const handleCollapseTraining = (item) => {
    const filterItem = {
      ...item,
      isOpen: false,
    };
    setTrainings(
      trainings.map((trainingItem) => {
        if (trainingItem.id === item.id) {
          return filterItem;
        }
        return trainingItem;
      })
    );
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
        <section className="mb-16">
          <h2 className="text-lg font-semibold mb-6">News</h2>

          {/* Highlighted Article */}
          <div className="md:flex gap-6 mb-10">
            <div className="bg-gray-300 w-full h-[250px] md:w-[50%]">
              <img
                src={`${baseHost}${news[0]?.picture?.url}`}
                alt=""
                className="size-full"
              />
            </div>
            <div className="mt-4 flex md:mt-0 md:w-[50%]">
              <div className="flex flex-col justify-between">
                <h3 className="text-xl font-bold">Berita Terbaru Hari Ini</h3>
                <h2
                  className="font-semibold text-lg"
                  onClick={() => handleOpenDetail(news[0])}
                >
                  {news[0]?.title}
                </h2>
                <p
                  className={clsx("text-gray-600", {
                    "line-clamp-2": !news[0]?.isOpen,
                  })}
                >
                  {news[0]?.description}
                </p>
                <p className="text-sm">Tanggal: 2025-03-19</p>
                <button
                  onClick={() => {
                    if (news[0]?.isOpen) {
                      handleCollapseNews(news[0]);
                    } else {
                      handleReadMoreNews(news[0]);
                    }
                  }}
                  className="mt-4 px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  {news[0]?.isOpen ? "Hide Detail" : "See More"}
                </button>
              </div>
            </div>
          </div>

          {/* Grid Artikel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {news.slice(1).map((item, i) => (
              <div key={i} className="bg-white rounded shadow p-2 h-fit">
                <div className="bg-gray-300 w-full h-[200px]">
                  <img
                    src={`${baseHost}${item.picture?.url}`}
                    className="size-full"
                  />
                </div>
                <h4
                  className="text-sm font-semibold mt-2 cursor-pointer"
                  onClick={() => handleOpenDetail(item)}
                >
                  {item.title}
                </h4>
                <p className="text-xs text-gray-500">
                  Tanggal: {dayjs(item.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                </p>
                <p
                  className={clsx("text-gray-600 mt-2", {
                    hidden: !item.isOpen,
                  })}
                >
                  {item.description}
                </p>
                <button
                  onClick={() => {
                    if (item.isOpen) {
                      handleCollapseNews(item);
                    } else {
                      handleReadMoreNews(item);
                    }
                  }}
                  className="mt-4 px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition w-full"
                >
                  {item.isOpen ? "Hide Detail" : "See More"}
                </button>
              </div>
            ))}
          </div>

          {/* Banner */}
          <div className="bg-gray-300 w-full h-[300px] mt-10 rounded flex">
            <Swiper
              spaceBetween={30}
              centeredSlides={true}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
              }}
              navigation={true}
              modules={[Autoplay, Pagination]}
              className="mySwiper"
            >
              {news.slice(0, 5).map((item, i) => (
                <SwiperSlide key={i}>
                  <img
                    src={`${baseHost}${item.picture?.url}`}
                    className="size-full cursor-pointer"
                    onClick={() => handleOpenDetail(item)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        {/* Training Section */}
        <section className="mb-20">
          <h2 className="text-lg font-semibold mb-6">Training</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trainings.map((item, i) => (
              <div key={i} className="bg-white rounded shadow p-2 h-fit">
                <div className="bg-gray-300 w-full h-[200px]">
                  <img
                    src={`${baseHost}${item.picture?.url}`}
                    className="size-full"
                  />
                </div>
                <h4
                  className="text-sm font-semibold mt-2 cursor-pointer"
                  onClick={() => handleOpenDetail(item, "training")}
                >
                  {item.title}
                </h4>
                <p className="text-xs text-gray-500">
                  Tanggal: {dayjs(item.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                </p>
                <p
                  className={clsx("text-gray-600 mt-2", {
                    hidden: !item.isOpen,
                  })}
                >
                  {item.description}
                </p>
                <button
                  onClick={() => {
                    if (item.isOpen) {
                      handleCollapseTraining(item);
                    } else {
                      handleReadMoreTraining(item);
                    }
                  }}
                  className="mt-4 px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition w-full"
                >
                  {item.isOpen ? "Hide Detail" : "See More"}
                </button>
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
        <div className="bg-white w-[80%] p-3 rounded max-h-[90vh] overflow-auto shadow-md absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:w-[60%] md:p-6">
          {/* Gambar (jika ada) */}
          {selectedNews?.picture?.url && (
            <div className="w-full h-[200px] mb-4 rounded overflow-hidden bg-gray-100 md:h-[300px]">
              <img
                src={`${baseHost}${selectedNews.picture?.url}`}
                alt={selectedNews.title}
                className="w-full h-full"
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
        <div className="bg-white w-[70%] p-3 rounded shadow-md absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:w-[60%] md:p-6">
          {/* Gambar (jika ada) */}
          {selectedTraining?.picture?.url && (
            <div className="w-full h-[200px] mb-4 rounded overflow-hidden bg-gray-100 md:h-[300px]">
              <img
                src={`${baseHost}${selectedTraining.picture?.url}`}
                alt={selectedTraining.title}
                className="w-full h-full"
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
