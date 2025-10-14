import { useEffect, useState } from "react";
import axios from "axios";
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Heart,
  Zap,
  Shield,
  Droplet,
  Flame,
  Leaf,
} from "lucide-react";

export default function App() {
  const [pokemon, setPokemons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pokemonDetail, setPokemonDetail] = useState([]);
  const [opened, setOpened] = useState(false);
  const [detailSelect, setDetailSelect] = useState(null);
  const [currentUrl, setCurrentUrl] = useState(
    "https://pokeapi.co/api/v2/pokemon?limit=20"
  );
  const [prevUrl, setPrevUrl] = useState("");
  const [nextUrl, setNextUrl] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(currentUrl)
      .then(function (response) {
        setPokemons(response.data.results);
        setPrevUrl(response.data.previous);
        setNextUrl(response.data.next);
        return Promise.all(
          response.data.results.map((pokemon) => axios.get(pokemon.url))
        );
      })
      .then((pokemonResponses) => {
        setPokemonDetail(pokemonResponses.map((pokeRes) => pokeRes.data));
        setIsLoading(false);
      })
      .catch(function (error) {
        console.error("Error fetching data: ", error);
        setIsLoading(false);
      });
  }, [currentUrl]);

  const handleOpened = (pokemon) => {
    setDetailSelect(pokemon);
    setOpened(true);
  };

  const handleClose = () => {
    setOpened(false);
    setDetailSelect(null);
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const getTypeColor = (type) => {
    const colors = {
      normal: "bg-gray-400",
      fire: "bg-red-500",
      water: "bg-blue-500",
      electric: "bg-yellow-400",
      grass: "bg-green-500",
      ice: "bg-cyan-400",
      fighting: "bg-orange-700",
      poison: "bg-purple-500",
      ground: "bg-yellow-700",
      flying: "bg-indigo-400",
      psychic: "bg-pink-500",
      bug: "bg-lime-500",
      rock: "bg-yellow-800",
      ghost: "bg-purple-700",
      dragon: "bg-indigo-700",
      dark: "bg-gray-800",
      steel: "bg-gray-500",
      fairy: "bg-pink-300",
    };
    return colors[type] || "bg-gray-400";
  };

  const getTypeIcon = (type) => {
    const icons = {
      fire: Flame,
      water: Droplet,
      grass: Leaf,
      electric: Zap,
      normal: Shield,
    };
    const Icon = icons[type] || Shield;
    return <Icon className="w-4 h-4" />;
  };

  const filteredPokemon = pokemonDetail.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900"
          : "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
      }`}
    >
      {/* Header */}
      <div
        className={`sticky top-0 z-40 backdrop-blur-lg ${
          darkMode ? "bg-gray-900/80" : "bg-white/80"
        } border-b ${darkMode ? "border-gray-800" : "border-gray-200"}`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h1
              className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent`}
            >
              PokéExplorer
            </h1>

            {/* Search Bar & Dark Mode Toggle Container */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Search Bar */}
              <div className="relative flex-1 sm:w-80">
                <Search
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  } w-5 h-5`}
                />
                <input
                  type="text"
                  placeholder="Search Pokémon..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-full ${
                    darkMode
                      ? "bg-gray-800 text-white border-gray-700"
                      : "bg-white text-gray-900 border-gray-300"
                  } border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                />
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-3 rounded-full transition-all flex-shrink-0 ${
                  darkMode
                    ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300"
                    : "bg-purple-600 text-white hover:bg-purple-700"
                } shadow-lg hover:shadow-xl`}
              >
                {darkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex flex-col justify-center items-center h-screen -mt-32">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 border-4 border-purple-200 rounded-full animate-ping"></div>
              <div className="absolute inset-0 border-4 border-t-purple-600 rounded-full animate-spin"></div>
            </div>
            <p
              className={`mt-4 text-lg ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Loading Pokémon...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPokemon.map((pokemon) => (
              <div
                key={pokemon.id}
                className={`group relative rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer ${
                  darkMode
                    ? "bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-purple-500"
                    : "bg-white border border-gray-200 hover:border-purple-400"
                } shadow-lg hover:shadow-2xl`}
                onClick={() => handleOpened(pokemon)}
              >
                {/* Favorite Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(pokemon.id);
                  }}
                  className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all ${
                    favorites.includes(pokemon.id)
                      ? "bg-red-500 text-white"
                      : darkMode
                      ? "bg-gray-700/80 text-gray-400 hover:text-red-400"
                      : "bg-white/80 text-gray-400 hover:text-red-500"
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${
                      favorites.includes(pokemon.id) ? "fill-current" : ""
                    }`}
                  />
                </button>

                {/* Pokemon Image */}
                <div
                  className={`relative h-48 flex items-center justify-center ${
                    darkMode
                      ? "bg-gray-700/30"
                      : "bg-gradient-to-br from-purple-100 to-pink-100"
                  }`}
                >
                  <img
                    src={
                      pokemon.sprites.other["official-artwork"].front_default ||
                      pokemon.sprites.other.dream_world.front_default
                    }
                    alt={pokemon.name}
                    className="w-36 h-36 object-contain drop-shadow-2xl transition-transform duration-300 group-hover:scale-110"
                  />
                  <div
                    className={`absolute top-2 left-2 px-3 py-1 rounded-full text-xs font-bold ${
                      darkMode ? "bg-gray-900/80" : "bg-white/80"
                    }`}
                  >
                    #{String(pokemon.id).padStart(3, "0")}
                  </div>
                </div>

                {/* Pokemon Info */}
                <div className="p-4">
                  <h2
                    className={`text-xl font-bold capitalize mb-2 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {pokemon.name}
                  </h2>

                  {/* Types */}
                  <div className="flex gap-2 mb-3">
                    {pokemon.types.map((type, idx) => (
                      <span
                        key={idx}
                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-white text-xs font-semibold ${getTypeColor(
                          type.type.name
                        )}`}
                      >
                        {getTypeIcon(type.type.name)}
                        {type.type.name}
                      </span>
                    ))}
                  </div>

                  {/* Stats Preview */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div
                      className={`${
                        darkMode ? "bg-gray-700/50" : "bg-gray-100"
                      } rounded-lg p-2`}
                    >
                      <div
                        className={`text-xs ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        HP
                      </div>
                      <div
                        className={`font-bold ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {pokemon.stats[0].base_stat}
                      </div>
                    </div>
                    <div
                      className={`${
                        darkMode ? "bg-gray-700/50" : "bg-gray-100"
                      } rounded-lg p-2`}
                    >
                      <div
                        className={`text-xs ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        ATK
                      </div>
                      <div
                        className={`font-bold ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {pokemon.stats[1].base_stat}
                      </div>
                    </div>
                    <div
                      className={`${
                        darkMode ? "bg-gray-700/50" : "bg-gray-100"
                      } rounded-lg p-2`}
                    >
                      <div
                        className={`text-xs ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        DEF
                      </div>
                      <div
                        className={`font-bold ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {pokemon.stats[2].base_stat}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-12">
          <button
            onClick={() => prevUrl && setCurrentUrl(prevUrl)}
            disabled={!prevUrl}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
              prevUrl
                ? darkMode
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-purple-500 hover:bg-purple-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            } shadow-lg hover:shadow-xl disabled:shadow-none`}
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>
          <button
            onClick={() => nextUrl && setCurrentUrl(nextUrl)}
            disabled={!nextUrl}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
              nextUrl
                ? darkMode
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-purple-500 hover:bg-purple-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            } shadow-lg hover:shadow-xl disabled:shadow-none`}
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Detail Modal */}
      {opened && detailSelect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl ${
              darkMode ? "bg-gray-800" : "bg-white"
            } shadow-2xl`}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all shadow-lg"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Header with Image */}
            <div
              className={`relative h-64 sm:h-80 ${
                darkMode
                  ? "bg-gradient-to-br from-gray-700 to-gray-900"
                  : "bg-gradient-to-br from-purple-200 to-pink-200"
              }`}
            >
              <img
                src={
                  detailSelect.sprites.other["official-artwork"]
                    .front_default ||
                  detailSelect.sprites.other.dream_world.front_default
                }
                alt={detailSelect.name}
                className="absolute inset-0 w-full h-full object-contain p-8 drop-shadow-2xl"
              />
              <div
                className={`absolute top-4 left-4 px-4 py-2 rounded-full font-bold ${
                  darkMode
                    ? "bg-gray-900/80 text-white"
                    : "bg-white/80 text-gray-900"
                }`}
              >
                #{String(detailSelect.id).padStart(3, "0")}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8">
              {/* Name and Types */}
              <div className="mb-6">
                <h2
                  className={`text-3xl sm:text-4xl font-bold capitalize mb-4 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {detailSelect.name}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {detailSelect.types.map((type, idx) => (
                    <span
                      key={idx}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-white font-semibold ${getTypeColor(
                        type.type.name
                      )}`}
                    >
                      {getTypeIcon(type.type.name)}
                      {type.type.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Physical Info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div
                  className={`${
                    darkMode ? "bg-gray-700" : "bg-gray-100"
                  } rounded-xl p-4 text-center`}
                >
                  <div
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    } mb-1`}
                  >
                    Height
                  </div>
                  <div
                    className={`text-2xl font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {(detailSelect.height / 10).toFixed(1)}m
                  </div>
                </div>
                <div
                  className={`${
                    darkMode ? "bg-gray-700" : "bg-gray-100"
                  } rounded-xl p-4 text-center`}
                >
                  <div
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    } mb-1`}
                  >
                    Weight
                  </div>
                  <div
                    className={`text-2xl font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {(detailSelect.weight / 10).toFixed(1)}kg
                  </div>
                </div>
                <div
                  className={`${
                    darkMode ? "bg-gray-700" : "bg-gray-100"
                  } rounded-xl p-4 text-center`}
                >
                  <div
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    } mb-1`}
                  >
                    Base Exp
                  </div>
                  <div
                    className={`text-2xl font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {detailSelect.base_experience}
                  </div>
                </div>
                <div
                  className={`${
                    darkMode ? "bg-gray-700" : "bg-gray-100"
                  } rounded-xl p-4 text-center`}
                >
                  <div
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    } mb-1`}
                  >
                    Abilities
                  </div>
                  <div
                    className={`text-2xl font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {detailSelect.abilities.length}
                  </div>
                </div>
              </div>

              {/* Abilities */}
              <div className="mb-6">
                <h3
                  className={`text-xl font-bold mb-3 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Abilities
                </h3>
                <div className="flex flex-wrap gap-3">
                  {detailSelect.abilities.map((item, index) => (
                    <div
                      key={index}
                      className={`px-4 py-2 rounded-xl font-semibold capitalize ${
                        darkMode
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                          : "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      } shadow-lg hover:shadow-xl transition-all`}
                    >
                      {item.ability.name.replace("-", " ")}
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div>
                <h3
                  className={`text-xl font-bold mb-4 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Base Stats
                </h3>
                <div className="space-y-3">
                  {detailSelect.stats.map((stat, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between mb-1">
                        <span
                          className={`text-sm font-medium capitalize ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {stat.stat.name.replace("-", " ")}
                        </span>
                        <span
                          className={`text-sm font-bold ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {stat.base_stat}
                        </span>
                      </div>
                      <div
                        className={`w-full h-3 rounded-full overflow-hidden ${
                          darkMode ? "bg-gray-700" : "bg-gray-200"
                        }`}
                      >
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                          style={{ width: `${(stat.base_stat / 255) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Moves Preview */}
              <div className="mt-6">
                <h3
                  className={`text-xl font-bold mb-3 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Available Moves ({detailSelect.moves.length})
                </h3>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {detailSelect.moves.slice(0, 12).map((move, idx) => (
                    <span
                      key={idx}
                      className={`px-3 py-1 rounded-lg text-xs font-medium capitalize ${
                        darkMode
                          ? "bg-gray-700 text-gray-300"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {move.move.name.replace("-", " ")}
                    </span>
                  ))}
                  {detailSelect.moves.length > 12 && (
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-medium ${
                        darkMode ? "text-purple-400" : "text-purple-600"
                      }`}
                    >
                      +{detailSelect.moves.length - 12} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer
        className={`mt-16 border-t ${
          darkMode
            ? "border-gray-800 bg-gray-900/50"
            : "border-gray-200 bg-white/50"
        } backdrop-blur-lg`}
      >
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Brand Section */}
            <div>
              <h3
                className={`text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3`}
              >
                PokéExplorer
              </h3>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Explore the wonderful world of Pokémon. Discover stats,
                abilities, and more!
              </p>
            </div>

            {/* Data Source */}
            <div>
              <h4
                className={`text-lg font-semibold mb-3 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Data Source
              </h4>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                } mb-2`}
              >
                Powered by PokéAPI
              </p>
              <a
                href="https://pokeapi.co"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-purple-600 hover:text-purple-700 underline"
              >
                pokeapi.co
              </a>
            </div>
          </div>

          {/* Bottom Bar */}
          <div
            className={`mt-8 pt-6 border-t ${
              darkMode ? "border-gray-800" : "border-gray-200"
            } text-center`}
          >
            <p
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              © {new Date().getFullYear()} PokéExplorer. Made by Rafi
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
