import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useSnackbar } from "nextjs-toast";

import SuccessfulBookings from "../../../components/landing-page/successful-bookings";
import StickyCart from "../../../components/profile/chef/sticky-cart";
import Cuisine from "../../../components/profile/chef/cuisine";
import DishGallery from "../../../components/profile/chef/dish-gallery";
import Dish from "../../../components/profile/chef/dish-details";

import { IMAGE_URL } from "../../../constants/enviroment-vars";
import { fetchChef } from "../../../store/actions/chef-actions";
import { fetchUserCusinesAndDishCount } from "../../../services/cuisine-api/user";
import { fetchUserChefDishesByCuisineId } from "../../../services/dish-api/user";
import useSyncDish from "../../../custom-hooks/use-sync-dish";
import cartHandler from "../../../utils/cart-handler";
import useChef from "../../../custom-hooks/use-chef";
import useUser from "../../../custom-hooks/use-user";

function Profile() {
  const router = useRouter();
  const dispatch = useDispatch();
  const snackbar = useSnackbar();
  const chef = useSelector((state) => state.chef.data);
  const { saveChef } = useChef();
  const { user } = useUser();

  const [cuisines, setCuisines] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [selectedCuisine, setSelectedCuisine] = useState({});
  const [loadingDishes, setLoadingDishes] = useState(true);
  const [loadingCuisines, setLoadingCuisines] = useState(true);

  const { syncedDishes, mutateCart, cartCount } = useSyncDish(
    selectedCuisine.id,
    dishes
  );

  const getDishesByCuisineId = useCallback(
    async (payload) => {
      try {
        const response = await fetchUserChefDishesByCuisineId(payload);
        setDishes(response || []);
      } catch (err) {
        console.log(err);
        setDishes([]);
        if (err.message.includes("404")) {
          snackbar.showMessage(
            "This cuisine doesn't contain any dishes",
            "error",
            "filled"
          );
          return;
        }
        snackbar.showMessage(
          "An error occured while fetching dishes probably a network error try refreshing the page",
          "error",
          "filled"
        );
      } finally {
        setLoadingDishes(false);
      }
    },
    [snackbar]
  );

  const getCuisineAndDishCount = useCallback(
    async (id) => {
      try {
        const response = await fetchUserCusinesAndDishCount(id);
        setCuisines(response || []);
        setSelectedCuisine(response[0]);
      } catch (err) {
        console.log(err);

        snackbar.showMessage(
          "An error occured while fetching cuisines probably a network error try refreshing the page",
          "error",
          "filled"
        );
      } finally {
        setLoadingCuisines(false);
      }
    },
    [snackbar]
  );

  // use effect to fetch cuisines
  useEffect(() => {
    if (router.isReady) {
      dispatch(fetchChef(router.query.id));
      getCuisineAndDishCount(router.query.id);
    }
  }, [router.query.id, router.isReady, dispatch, getCuisineAndDishCount]);

  // useffect to fetch dishes
  useEffect(() => {
    const payload = {
      cuisineId: selectedCuisine.id,
      chefId: router.query.id,
    };

    if (selectedCuisine.id && router.query.id) {
      getDishesByCuisineId(payload);
    }
  }, [selectedCuisine.id, router.query.id, getDishesByCuisineId]);

  useEffect(() => {
    saveChef(chef);
  }, [chef, saveChef]);

  const handleSelectedCuisine = (cuisine) => {
    setLoadingDishes(true);
    setSelectedCuisine(cuisine);
  };

  return (
    <div className="pt-32">
      {/* sticky cart */}
      {cartCount && !loadingDishes ? (
        <StickyCart total={cartCount} canProceed={user ? true : false} />
      ) : null}

      <div className="w-11/12 mx-auto">
        {/* breadcrumbs */}
        <div className="mb-10 text-sm">
          Home / San Diego / Party / Louis Ford
        </div>

        <div className="flex mb-14">
          <section className="md:w-1/2">
            <div className="flex items-center mb-6">
              <div className="relative bg-gray-200 h-16 w-16 rounded-full">
                <Image
                  src={`${IMAGE_URL}${chef?.profilePic}`}
                  alt="chef"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              </div>

              <div className="ml-5">
                <h4 className="text-lg capitalize font-semibold mb-1">
                  {!chef?.fullName ? <Skeleton /> : chef?.fullName}
                </h4>

                <p>
                  {chef?.city?.name} {chef?.city?.stateCode}
                </p>
              </div>
            </div>

            <p className="mb-8">{chef?.description}</p>

            <div className="flex items-center">
              <button className="border border-black font-medium py-3 px-4 rounded-lg mr-4">
                Past Bookings
              </button>
              <button className="text-red-600 font-medium">
                + Add A Review
              </button>
            </div>
          </section>

          <section className="w-1/2 hidden md:block" style={{ height: 240 }}>
            <DishGallery images={chef?.galleryImages} />
          </section>
        </div>

        <h2 className="font-semibold md:text-3xl text-xl md:mb-6 mb-5">
          Cuisines
        </h2>

        <div className="mb-14 bg-white">
          {!loadingCuisines ? (
            <div
              className="flex bg-white"
              style={{ overflowX: "auto", columnGap: 30 }}
            >
              {cuisines.map((cuisine) => (
                <Cuisine
                  cuisine={cuisine}
                  isActive={selectedCuisine.id === cuisine.id}
                  setSelected={handleSelectedCuisine}
                  key={cuisine.id}
                />
              ))}
            </div>
          ) : (
            <div>Loading...</div>
          )}
        </div>

        <h2 className="font-semibold text-3xl mb-6">
          {selectedCuisine.name} Dishes
        </h2>

        <div className="grid md:grid-cols-4 grid-cols-1 gap-x-8 gap-y-16">
          {loadingDishes ? (
            <div>Loading...</div>
          ) : (
            <>
              {syncedDishes.map((dish, index) => (
                <Dish
                  dishDetail={dish}
                  handleCart={(actionType, dishId) =>
                    cartHandler(
                      actionType,
                      dishId,
                      selectedCuisine.id,
                      syncedDishes,
                      mutateCart
                    )
                  }
                  key={index}
                />
              ))}
            </>
          )}
        </div>
      </div>

      <SuccessfulBookings />
    </div>
  );
}

export default Profile;