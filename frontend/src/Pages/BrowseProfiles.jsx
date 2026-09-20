import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from "react";

import {
  Filter,
  X,
  Search,
  Users,
  MapPin,
  Calendar,
  IndianRupee,
  Heart,
  RotateCcw,
  FileText,
  Edit,
  Trash2,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import Loader from "../Components/Loader";

const API_URL = import.meta.env.VITE_API_URL;

const LIMIT = 25;

const PLACEHOLDER_IMG =
  "https://placehold.co/300x400?text=No+Photo";

// =====================================================
// IMAGE OPTIMIZATION
// =====================================================

const optimizeImage = (url, width = 400) => {
  if (!url || url.includes("placehold.co")) {
    return url;
  }

  return url.replace(
    "/profiles/",
    `/tr:w-${width},q-80,f-webp/profiles/`
  );
};

// =====================================================
// SAVED FILTERS
// =====================================================

const getSavedFilters = () => {
  try {
    return JSON.parse(
      sessionStorage.getItem("browseFilters") || "{}"
    );
  } catch {
    return {};
  }
};

// =====================================================
// COMPONENT
// =====================================================

const BrowseProfiles = () => {
  const navigate = useNavigate();

  const { user, token } =
    useContext(AuthContext);

  // ---------------------------------------------------
  // SAVED DATA
  // ---------------------------------------------------

  const saved = useRef(
    getSavedFilters()
  ).current;

  // ---------------------------------------------------
  // PROFILE STATE
  // ---------------------------------------------------

  const [profiles, setProfiles] =
    useState([]);

  const [selectedImage, setSelectedImage] =
    useState(null);

  // ---------------------------------------------------
  // LOADING / ERROR
  // ---------------------------------------------------

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ---------------------------------------------------
  // PAGINATION
  // ---------------------------------------------------

  const [currentPage, setCurrentPage] =
    useState(
      Math.max(
        Number(saved.currentPage) || 1,
        1
      )
    );

  const [totalCount, setTotalCount] =
    useState(0);

  const [hasMore, setHasMore] =
    useState(false);

  // ---------------------------------------------------
  // FILTERS
  // ---------------------------------------------------

  const [nameSearch, setNameSearch] =
    useState(saved.nameSearch || "");

  const [gender, setGender] =
    useState(saved.gender || "");

  const [cityInput, setCityInput] =
    useState(saved.city || "");

  const [city, setCity] =
    useState(saved.city || "");

  const [maritalStatus, setMaritalStatus] =
    useState(
      saved.maritalStatus || ""
    );

  const [ageRange, setAgeRange] =
    useState(saved.ageRange || "");

  const [incomeRange, setIncomeRange] =
    useState(
      saved.incomeRange || ""
    );

  // ---------------------------------------------------
  // UI
  // ---------------------------------------------------

  const [showFilters, setShowFilters] =
    useState(false);

  // ---------------------------------------------------
  // REFS
  // ---------------------------------------------------

  const firstLoad = useRef(true);

  const restoringBrowse =
    useRef(true);

  const filterRequestRef =
    useRef(false);

  // =====================================================
  // AGE CALCULATION
  // =====================================================

  const calculateAge = useCallback(
    (dob) => {
      if (!dob) return 0;

      const birthDate =
        new Date(dob);

      const today =
        new Date();

      let age =
        today.getFullYear() -
        birthDate.getFullYear();

      const month =
        today.getMonth() -
        birthDate.getMonth();

      if (
        month < 0 ||
        (month === 0 &&
          today.getDate() <
            birthDate.getDate())
      ) {
        age--;
      }

      return age;
    },
    []
  );

  // =====================================================
  // API PARAMS
  // =====================================================

  const getParams = useCallback(
    (page) => {
      const params = {
        page,
        limit: LIMIT,
      };

      // NAME

      if (nameSearch.trim()) {
        params.name =
          nameSearch.trim();
      }

      // GENDER

      if (gender) {
        params.gender = gender;
      }

      // CITY

      if (city.trim()) {
        params.city =
          city.trim();
      }

      // MARITAL STATUS

      if (maritalStatus) {
        params.maritalStatus =
          maritalStatus;
      }

      // AGE

      if (ageRange) {
        const [
          minAge,
          maxAge,
        ] = ageRange.split("-");

        params.minAge = minAge;
        params.maxAge = maxAge;
      }

      // INCOME

      if (incomeRange) {
        const [
          minIncome,
          maxIncome,
        ] =
          incomeRange.split("-");

        params.minIncome =
          minIncome;

        params.maxIncome =
          maxIncome;
      }

      return params;
    },
    [
      nameSearch,
      gender,
      city,
      maritalStatus,
      ageRange,
      incomeRange,
    ]
  );

  // =====================================================
  // FETCH SINGLE PAGE
  // =====================================================

  const fetchPage = useCallback(
    async (
      page,
      append = false,
      signal
    ) => {
      const response =
        await axios.get(
          `${API_URL}/api/profile`,
          {
            params:
              getParams(page),

            signal,
          }
        );

      const data =
        response.data;

      const newProfiles =
        data.profiles || [];

      setProfiles((prev) =>
        append
          ? [
              ...prev,
              ...newProfiles,
            ]
          : newProfiles
      );

      setTotalCount(
        Number(data.total) || 0
      );

      setCurrentPage(
        Number(data.page) ||
          page
      );

      setHasMore(
        Boolean(data.hasMore)
      );

      return data;
    },
    [getParams]
  );

  // =====================================================
  // CITY DEBOUNCE
  // =====================================================

  useEffect(() => {
    const timer =
      setTimeout(() => {
        const trimmedCity =
          cityInput.trim();

        setCity(
          trimmedCity
        );
      }, 400);

    return () =>
      clearTimeout(timer);
  }, [cityInput]);

  // =====================================================
  // INITIAL LOAD
  //
  // IMPORTANT:
  // Previously pages were loaded one-by-one.
  //
  // Now pages are requested in parallel.
  // =====================================================

  useEffect(() => {
    if (!firstLoad.current) {
      return;
    }

    firstLoad.current = false;

    const controller =
      new AbortController();

    const loadProfiles =
      async () => {
        try {
          setLoading(true);
          setError("");

          const savedPage =
            Math.max(
              Number(
                saved.currentPage
              ) || 1,
              1
            );

          // ---------------------------------------------
          // PAGE 1
          // ---------------------------------------------

          if (savedPage === 1) {
            await fetchPage(
              1,
              false,
              controller.signal
            );
          }

          // ---------------------------------------------
          // MULTIPLE PAGES
          //
          // Load them simultaneously
          // ---------------------------------------------

          else {
            const pages =
              Array.from(
                {
                  length:
                    savedPage,
                },
                (_, index) =>
                  index + 1
              );

            const responses =
              await Promise.all(
                pages.map(
                  (page) =>
                    axios.get(
                      `${API_URL}/api/profile`,
                      {
                        params:
                          getParams(
                            page
                          ),

                        signal:
                          controller.signal,
                      }
                    )
                )
              );

            // -------------------------------------------
            // COMBINE ALL PROFILES
            // -------------------------------------------

            const allProfiles =
              responses.flatMap(
                (response) =>
                  response.data
                    ?.profiles || []
              );

            const lastResponse =
              responses[
                responses.length -
                  1
              ];

            const lastData =
              lastResponse.data;

            // -------------------------------------------
            // UPDATE STATE ONCE
            // -------------------------------------------

            setProfiles(
              allProfiles
            );

            setTotalCount(
              Number(
                lastData.total
              ) || 0
            );

            setCurrentPage(
              Number(
                lastData.page
              ) ||
                savedPage
            );

            setHasMore(
              Boolean(
                lastData.hasMore
              )
            );
          }
        } catch (err) {
          // Ignore cancelled request

          if (
            axios.isCancel(err)
          ) {
            return;
          }

          console.error(
            "Initial profile load:",
            err
          );

          setError(
            err.response?.data
              ?.message ||
              "Failed to load profiles"
          );
        } finally {
          setLoading(false);

          // Saved pages are now restored

          restoringBrowse.current =
            false;
        }
      };

    loadProfiles();

    return () => {
      controller.abort();
    };
  }, [
    fetchPage,
    getParams,
    saved.currentPage,
  ]);

  // =====================================================
  // FILTER CHANGE
  // =====================================================

  useEffect(() => {
    // Don't run during initial restore

    if (
      firstLoad.current ||
      restoringBrowse.current
    ) {
      return;
    }

    const controller =
      new AbortController();

    const timer =
      setTimeout(async () => {
        try {
          filterRequestRef.current =
            true;

          setLoading(true);
          setError("");

          // New filters always start from page 1

          await fetchPage(
            1,
            false,
            controller.signal
          );

          setCurrentPage(1);
        } catch (err) {
          if (
            axios.isCancel(err)
          ) {
            return;
          }

          console.error(
            "Filter profile load:",
            err
          );

          setError(
            err.response?.data
              ?.message ||
              "Failed to load profiles"
          );
        } finally {
          filterRequestRef.current =
            false;

          setLoading(false);
        }
      }, 500);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [
    nameSearch,
    gender,
    city,
    maritalStatus,
    ageRange,
    incomeRange,
    fetchPage,
  ]);

  // =====================================================
  // SAVE FILTER STATE
  // =====================================================

  useEffect(() => {
    sessionStorage.setItem(
      "browseFilters",
      JSON.stringify({
        nameSearch,
        gender,
        city,
        maritalStatus,
        ageRange,
        incomeRange,
        currentPage,
      })
    );
  }, [
    nameSearch,
    gender,
    city,
    maritalStatus,
    ageRange,
    incomeRange,
    currentPage,
  ]);

  // =====================================================
  // RESTORE EXACT PROFILE / SCROLL
  // =====================================================

  useEffect(() => {
    // Don't restore until all saved pages loaded

    if (
      restoringBrowse.current
    ) {
      return;
    }

    const profileId =
      sessionStorage.getItem(
        "browseReturnProfileId"
      );

    const scroll =
      sessionStorage.getItem(
        "browseScrollPosition"
      );

    if (!profileId && !scroll) {
      return;
    }

    if (!profiles.length) {
      return;
    }

    const timer =
      setTimeout(() => {
        const element =
          profileId
            ? document.getElementById(
                `profile-${profileId}`
              )
            : null;

        // ---------------------------------------------
        // Exact profile
        // ---------------------------------------------

        if (element) {
          element.scrollIntoView({
            behavior: "auto",
            block: "center",
          });
        }

        // ---------------------------------------------
        // Fallback scroll
        // ---------------------------------------------

        else if (scroll) {
          window.scrollTo({
            top: Number(scroll),
            behavior: "auto",
          });
        }

        // ---------------------------------------------
        // Clear restore state
        // ---------------------------------------------

        sessionStorage.removeItem(
          "browseReturnProfileId"
        );

        sessionStorage.removeItem(
          "browseScrollPosition"
        );

        sessionStorage.removeItem(
          "browseReturnPage"
        );
      }, 150);

    return () =>
      clearTimeout(timer);
  }, [profiles]);

  // =====================================================
  // SHOW MORE
  // =====================================================

  const handleShowMore =
    useCallback(async () => {
      if (
        loading ||
        !hasMore
      ) {
        return;
      }

      try {
        setLoading(true);

        await fetchPage(
          currentPage + 1,
          true
        );
      } catch (err) {
        if (
          axios.isCancel(err)
        ) {
          return;
        }

        console.error(err);

        toast.error(
          err.response?.data
            ?.message ||
            "Failed to load more profiles"
        );
      } finally {
        setLoading(false);
      }
    }, [
      loading,
      hasMore,
      currentPage,
      fetchPage,
    ]);

  // =====================================================
  // OPEN PROFILE
  // =====================================================

  const openProfile =
    useCallback(
      (profileId) => {
        // Current scroll position

        sessionStorage.setItem(
          "browseScrollPosition",
          String(
            window.scrollY
          )
        );

        // Exact profile

        sessionStorage.setItem(
          "browseReturnProfileId",
          profileId
        );

        // Current loaded page

        sessionStorage.setItem(
          "browseReturnPage",
          String(currentPage)
        );

        navigate(
          `/browse-profile/${profileId}`
        );
      },
      [currentPage, navigate]
    );

  // =====================================================
  // DELETE PROFILE
  // =====================================================

  const handleDelete =
    useCallback(
      async (profileId) => {
        const confirmDelete =
          window.confirm(
            "Are you sure you want to delete this profile?"
          );

        if (!confirmDelete) {
          return;
        }

        try {
          await axios.delete(
            `${API_URL}/api/profile/delete/${profileId}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

          // Remove from UI immediately

          setProfiles((prev) =>
            prev.filter(
              (profile) =>
                profile._id !==
                profileId
            )
          );

          // Update total

          setTotalCount(
            (prev) =>
              Math.max(
                0,
                prev - 1
              )
          );

          toast.success(
            "Profile deleted successfully!"
          );
        } catch (err) {
          console.error(err);

          toast.error(
            err.response?.data
              ?.message ||
              "Failed to delete profile"
          );
        }
      },
      [token]
    );

  // =====================================================
  // RESET FILTERS
  // =====================================================

  const resetFilters =
    useCallback(() => {
      setNameSearch("");
      setGender("");
      setCityInput("");
      setCity("");
      setMaritalStatus("");
      setAgeRange("");
      setIncomeRange("");

      setCurrentPage(1);

      sessionStorage.removeItem(
        "browseFilters"
      );
    }, []);

  // =====================================================
  // INITIAL LOADING
  // =====================================================

  if (
    loading &&
    profiles.length === 0
  ) {
    return <Loader />;
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="px-4 py-20 text-center text-red-600">
        {error}
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <section className="min-h-screen w-full overflow-x-hidden py-6 sm:py-8 lg:py-10">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">
              Browse Matches
            </h2>

            <p className="mt-1 text-sm text-gray-500 sm:text-base">
              {totalCount} Profiles Found
            </p>

            {/* ============================================
                ACTIVE FILTERS
            ============================================ */}

            {(nameSearch ||
              gender ||
              city ||
              maritalStatus ||
              ageRange ||
              incomeRange) && (
              <div className="mt-3 flex flex-wrap gap-2">

                {/* NAME */}

                {nameSearch && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                    Name: {nameSearch}

                    <button
                      type="button"
                      onClick={() =>
                        setNameSearch("")
                      }
                      className="ml-1 flex h-4 w-4 items-center justify-center rounded-full hover:bg-blue-200"
                      aria-label="Remove name filter"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}

                {/* GENDER */}

                {gender && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-pink-100 px-3 py-1 text-xs font-medium text-pink-700">
                    Gender: {gender}

                    <button
                      type="button"
                      onClick={() =>
                        setGender("")
                      }
                      className="ml-1 flex h-4 w-4 items-center justify-center rounded-full hover:bg-pink-200"
                      aria-label="Remove gender filter"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}

                {/* CITY */}

                {city && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                    City: {city}

                    <button
                      type="button"
                      onClick={() => {
                        setCity("");
                        setCityInput("");
                      }}
                      className="ml-1 flex h-4 w-4 items-center justify-center rounded-full hover:bg-green-200"
                      aria-label="Remove city filter"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}

                {/* MARITAL STATUS */}

                {maritalStatus && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                    Status:{" "}
                    {maritalStatus}

                    <button
                      type="button"
                      onClick={() =>
                        setMaritalStatus(
                          ""
                        )
                      }
                      className="ml-1 flex h-4 w-4 items-center justify-center rounded-full hover:bg-purple-200"
                      aria-label="Remove marital status filter"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}

                {/* AGE */}

                {ageRange && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
                    Age: {ageRange}

                    <button
                      type="button"
                      onClick={() =>
                        setAgeRange("")
                      }
                      className="ml-1 flex h-4 w-4 items-center justify-center rounded-full hover:bg-orange-200"
                      aria-label="Remove age filter"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}

                {/* SALARY */}

                {incomeRange && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                    Salary:{" "}
                    {incomeRange
                      .split("-")
                      .map(
                        (value) =>
                          Number(
                            value
                          ).toLocaleString(
                            "en-IN"
                          )
                      )
                      .join(
                        " - ₹"
                      )}

                    <button
                      type="button"
                      onClick={() =>
                        setIncomeRange(
                          ""
                        )
                      }
                      className="ml-1 flex h-4 w-4 items-center justify-center rounded-full hover:bg-emerald-200"
                      aria-label="Remove salary filter"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* FILTER BUTTON */}

          <button
            onClick={() =>
              setShowFilters(true)
            }
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-2.5 text-white shadow-md transition hover:bg-red-600 sm:w-auto sm:px-6 sm:py-3"
          >
            <Filter size={18} />

            Filters
          </button>
        </div>

        {/* =================================================
            FILTER MODAL
        ================================================= */}

        {showFilters && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 backdrop-blur-sm sm:items-center sm:p-4">

            <div className="max-h-[95vh] w-full overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:max-h-[90vh] sm:max-w-2xl sm:rounded-2xl">

              {/* MODAL HEADER */}

              <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-4 py-4 sm:px-6">

                <div>
                  <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                    Filter Profiles
                  </h2>

                  <p className="text-xs text-gray-500 sm:text-sm">
                    Find your perfect match
                  </p>
                </div>

                <button
                  onClick={() =>
                    setShowFilters(
                      false
                    )
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>

              {/* FILTER CONTENT */}

              <div className="p-4 sm:p-5">

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

                  {/* NAME */}

                  <div>
                    <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Search size={15} />
                      Name
                    </label>

                    <div className="relative">
                      <Search
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        value={
                          nameSearch
                        }
                        onChange={(e) =>
                          setNameSearch(
                            e.target
                              .value
                          )
                        }
                        placeholder="Search by name"
                        className="h-11 w-full rounded-lg border border-gray-300 pl-9 pr-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>

                  {/* GENDER */}

                  <div>
                    <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Users size={15} />
                      Gender
                    </label>

                    <select
                      value={
                        gender
                      }
                      onChange={(e) =>
                        setGender(
                          e.target
                            .value
                        )
                      }
                      className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">
                        Select Gender
                      </option>

                      <option value="Male">
                        Male
                      </option>

                      <option value="Female">
                        Female
                      </option>
                    </select>
                  </div>

                  {/* CITY */}

                  <div>
                    <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700">
                      <MapPin size={15} />
                      City
                    </label>

                    <div className="relative">
                      <Search
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        value={
                          cityInput
                        }
                        onChange={(e) =>
                          setCityInput(
                            e.target
                              .value
                          )
                        }
                        placeholder="Search City"
                        className="h-11 w-full rounded-lg border border-gray-300 pl-9 pr-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>

                  {/* AGE */}

                  <div>
                    <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Calendar size={15} />
                      Age
                    </label>

                    <select
                      value={
                        ageRange
                      }
                      onChange={(e) =>
                        setAgeRange(
                          e.target
                            .value
                        )
                      }
                      className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">
                        Select Age
                      </option>

                      <option value="18-20">
                        18-20
                      </option>

                      <option value="21-25">
                        21-25
                      </option>

                      <option value="26-30">
                        26-30
                      </option>

                      <option value="31-35">
                        31-35
                      </option>

                      <option value="36-40">
                        36-40
                      </option>
                    </select>
                  </div>

                  {/* INCOME */}

                  <div>
                    <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700">
                      <IndianRupee size={15} />
                      Salary
                    </label>

                    <select
                      value={
                        incomeRange
                      }
                      onChange={(e) =>
                        setIncomeRange(
                          e.target
                            .value
                        )
                      }
                      className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">
                        Select Salary
                      </option>

                      <option value="200000-500000">
                        2 LPA - 5 LPA
                      </option>

                      <option value="600000-1000000">
                        6 LPA - 10 LPA
                      </option>

                      <option value="1100000-1500000">
                        11 LPA - 15 LPA
                      </option>

                      <option value="1600000-2000000">
                        16 LPA - 20 LPA
                      </option>

                      <option value="2100000-2500000">
                        21 LPA - 25 LPA
                      </option>

                      <option value="2600000-3000000">
                        26 LPA - 30 LPA
                      </option>
                    </select>
                  </div>

                  {/* MARITAL STATUS */}

                  <div>
                    <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Heart size={15} />
                      Marital Status
                    </label>

                    <select
                      value={
                        maritalStatus
                      }
                      onChange={(e) =>
                        setMaritalStatus(
                          e.target
                            .value
                        )
                      }
                      className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">
                        Select Status
                      </option>

                      <option value="Unmarried">
                        Unmarried
                      </option>

                      <option value="Married">
                        Married
                      </option>

                      <option value="Divorced">
                        Divorced
                      </option>

                      <option value="Widowed">
                        Widowed
                      </option>

                      <option value="Separated">
                        Separated
                      </option>
                    </select>
                  </div>
                </div>

                {/* FILTER ACTIONS */}

                <div className="mt-6 flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">

                  <button
                    onClick={
                      resetFilters
                    }
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-5 text-sm font-medium hover:bg-gray-100 sm:w-auto"
                  >
                    <RotateCcw size={16} />

                    Reset
                  </button>

                  <button
                    onClick={() =>
                      setShowFilters(
                        false
                      )
                    }
                    className="h-11 w-full rounded-lg bg-red-500 px-6 text-sm font-medium text-white shadow-md hover:bg-red-600 sm:w-auto"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================
            LOADING
        ================================================= */}

        {loading &&
          profiles.length > 0 && (
            <div className="mb-5 text-center text-sm text-gray-400">
              Loading profiles...
            </div>
          )}

        {/* =================================================
            EMPTY
        ================================================= */}

        {!loading &&
          profiles.length === 0 && (
            <div className="py-16 text-center text-gray-500">
              No profiles found
            </div>
          )}

        {/* =================================================
            PROFILE GRID
        ================================================= */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">

          {profiles.map(
            (profile) => (
              <div
                key={
                  profile._id
                }
                id={`profile-${profile._id}`}
                className="min-w-0 overflow-hidden rounded-2xl bg-white shadow transition hover:shadow-xl"
              >

                {/* ========================================
                    IMAGE
                ======================================== */}

                <div className="aspect-[4/4] w-full overflow-hidden bg-gray-100">

                  <img
                    src={
                      optimizeImage(
                        profile.photo,
                        400
                      ) ||
                      PLACEHOLDER_IMG
                    }
                    alt={
                      profile.name ||
                      "Profile"
                    }
                    loading="lazy"
                    decoding="async"
                    width="400"
                    height="400"
                    className="!h-full !w-full cursor-pointer object-cover object-top transition hover:opacity-90"
                    onClick={() =>
                      setSelectedImage(
                        profile.photo ||
                          PLACEHOLDER_IMG
                      )
                    }
                  />
                </div>

                {/* ========================================
                    NAME / CITY
                ======================================== */}

                <div className="p-4">

                  <h3 className="truncate text-base font-semibold capitalize sm:text-lg">
                    {
                      profile.name
                    }
                  </h3>

                  <p className="mt-1 truncate text-sm text-gray-500">
                    {
                      profile.city
                    }
                  </p>
                </div>

                {/* ========================================
                    DETAILS
                ======================================== */}

                <div className="px-4 pb-4 text-sm">

                  <div className="mb-4 grid grid-cols-2 gap-x-3 gap-y-4">

                    {/* AGE */}

                    <div className="min-w-0">

                      <p className="text-xs text-gray-400">
                        AGE
                      </p>

                      <p className="truncate font-medium">
                        {calculateAge(
                          profile.dob
                        )}
                      </p>
                    </div>

                    {/* INCOME */}

                    <div className="min-w-0">

                      <p className="text-xs text-gray-400">
                        INCOME
                      </p>

                      <p className="truncate font-medium">
                        ₹
                        {
                          profile.income
                        }
                      </p>
                    </div>

                    {/* EDUCATION */}

                    <div className="min-w-0">

                      <p className="text-xs text-gray-400">
                        EDUCATION
                      </p>

                      <p className="truncate font-medium">
                        {
                          profile.education
                        }
                      </p>
                    </div>

                    {/* PROFESSION */}

                    <div className="min-w-0">

                      <p className="text-xs text-gray-400">
                        PROFESSION
                      </p>

                      <p className="truncate font-medium">
                        {
                          profile.occupation
                        }
                      </p>
                    </div>
                  </div>

                  {/* ======================================
                      VIEW PROFILE
                  ====================================== */}

                  <button
                    onClick={() =>
                      openProfile(
                        profile._id
                      )
                    }
                    className="flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-200"
                  >
                    <FileText
                      size={16}
                    />

                    View Full Biodata
                  </button>

                  {/* ======================================
                      ADMIN BUTTONS
                  ====================================== */}

                  {user?.role ===
                    "admin" && (
                    <div className="mt-2 grid grid-cols-2 gap-2">

                      {/* EDIT */}

                      <button
                        onClick={() =>
                          navigate(
                            `/update-profile/${profile._id}`
                          )
                        }
                        className="flex min-h-10 items-center justify-center gap-1.5 rounded-lg bg-green-100 px-2 py-2 text-sm font-medium text-green-700 hover:bg-green-200"
                      >
                        <Edit
                          size={15}
                        />

                        Edit
                      </button>

                      {/* DELETE */}

                      <button
                        onClick={() =>
                          handleDelete(
                            profile._id
                          )
                        }
                        className="flex min-h-10 items-center justify-center gap-1.5 rounded-lg bg-red-100 px-2 py-2 text-sm font-medium text-red-700 hover:bg-red-200"
                      >
                        <Trash2
                          size={15}
                        />

                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          )}
        </div>

        {/* =================================================
            SHOW MORE
        ================================================= */}

        {hasMore && (
          <div className="mt-8 flex justify-center sm:mt-10">

            <button
              onClick={
                handleShowMore
              }
              disabled={loading}
              className="w-full rounded-xl bg-red-500 px-8 py-3 font-medium text-white shadow-md transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-[180px]"
            >
              {loading
                ? "Loading..."
                : "Show More"}
            </button>
          </div>
        )}
      </div>

      {/* =================================================
          IMAGE PREVIEW
      ================================================= */}

      {selectedImage && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-3 sm:p-5"
          onClick={() =>
            setSelectedImage(
              null
            )
          }
        >

          {/* CLOSE */}

          <button
            onClick={() =>
              setSelectedImage(
                null
              )
            }
            className="absolute right-3 top-3 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-black hover:bg-gray-200 sm:right-5 sm:top-5 sm:px-4 sm:text-base"
          >
            ✕ Close
          </button>

          {/* IMAGE */}

          <img
            src={
              optimizeImage(
                selectedImage,
                1000
              ) ||
              PLACEHOLDER_IMG
            }
            alt="Profile Preview"
            onClick={(e) =>
              e.stopPropagation()
            }
            className="!h-[85vh] !w-full rounded-lg object-contain shadow-2xl sm:rounded-xl"
          />
        </div>
      )}
    </section>
  );
};

export default BrowseProfiles;