import { Calendar, Clock, MapPin, Search, Users } from "lucide-react";
import { useMemo, useState } from "react";

const exhibitionBlueprint = [
  {
    id: 1,
    title: "Colombo Coastal Expressions",
    venue: "Colombo Art Walkway",
    start: "2025-11-05T10:00:00",
    end: "2025-11-10T18:00:00",
    curator: "Ishara Perera",
    expectedVisitors: 320,
  },
  {
    id: 2,
    title: "Kandy Heritage Revival",
    venue: "Temple Square Gallery",
    start: "2025-11-18T09:30:00",
    end: "2025-11-22T17:30:00",
    curator: "Ruwan Madushanka",
    expectedVisitors: 450,
  },
  {
    id: 3,
    title: "Digital Dreams Of Lanka",
    venue: "Galle Fort Collective",
    start: "2025-12-02T11:00:00",
    end: "2025-12-06T19:00:00",
    curator: "Ayani Jayawardena",
    expectedVisitors: 510,
  },
];

const formatDate = (value) =>
  new Date(value).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

const ModeratorExhibition = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const summary = useMemo(() => {
    const total = exhibitionBlueprint.length;
    const visitors = exhibitionBlueprint.reduce(
      (sum, item) => sum + item.expectedVisitors,
      0,
    );
    return { total, visitors };
  }, []);

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) {
      return exhibitionBlueprint;
    }
    const term = searchTerm.toLowerCase();
    return exhibitionBlueprint.filter(
      ({ title, venue, curator }) =>
        title.toLowerCase().includes(term) ||
        venue.toLowerCase().includes(term) ||
        curator.toLowerCase().includes(term),
    );
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-custom-yellow-light pb-12">
      <div className="relative overflow-hidden border-b border-custom-orange-light bg-custom-brown-dark px-6 py-10 text-custom-yellow-light shadow-lg">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold tracking-tight">Exhibition Planning</h1>
          <p className="mt-2 max-w-3xl text-sm text-custom-orange-light">
            Track upcoming exhibitions curated by the moderator team. Use the search
            bar to locate venues or curators and review capacity outlooks before
            approvals are finalised.
          </p>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-6xl px-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-custom-orange-light bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-custom-orange">
              Scheduled Exhibitions
            </p>
            <div className="mt-2 flex items-center gap-2 text-3xl font-bold text-custom-brown-dark">
              <Calendar size={24} />
              <span>{summary.total}</span>
            </div>
          </div>
          <div className="rounded-lg border border-custom-orange-light bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-custom-orange">
              Projected Visitor Count
            </p>
            <div className="mt-2 flex items-center gap-2 text-3xl font-bold text-custom-brown-dark">
              <Users size={24} />
              <span>{summary.visitors.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold text-custom-brown-dark">
            Upcoming Schedule
          </h2>
          <label className="relative flex w-full items-center sm:w-80">
            <Search className="pointer-events-none absolute left-3 h-4 w-4 text-custom-orange" />
            <input
              type="text"
              className="w-full rounded-full border border-custom-orange-light bg-white py-2 pl-10 pr-4 text-sm text-custom-brown-dark placeholder:text-custom-orange focus:outline-none focus:ring-2 focus:ring-custom-orange"
              placeholder="Search by title, venue, or curator"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </label>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {filtered.map((item) => (
            <article
              key={item.id}
              className="flex h-full flex-col rounded-xl border border-custom-orange-light bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-custom-brown-dark">
                {item.title}
              </h3>
              <p className="mt-2 flex items-center gap-2 text-sm text-custom-orange">
                <MapPin size={16} />
                <span>{item.venue}</span>
              </p>
              <p className="mt-2 flex items-center gap-2 text-sm text-custom-brown-dark">
                <Clock size={16} />
                <span>
                  {formatDate(item.start)} - {formatDate(item.end)}
                </span>
              </p>
              <p className="mt-2 text-sm text-custom-brown-dark">
                Curated by <span className="font-medium">{item.curator}</span>
              </p>
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-custom-yellow-light px-3 py-2 text-sm text-custom-brown-dark">
                <Users size={16} />
                <span>{item.expectedVisitors.toLocaleString()} expected visitors</span>
              </div>
            </article>
          ))}
          {filtered.length === 0 && (
            <div className="rounded-xl border border-dashed border-custom-orange-light bg-white p-6 text-center text-sm text-custom-orange">
              No exhibitions match your search. Adjust filters to see more results.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModeratorExhibition;
