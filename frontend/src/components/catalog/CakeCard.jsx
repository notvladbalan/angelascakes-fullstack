import { Link } from "react-router-dom";

function formatPrice(price) {
  return `$${Number(price).toFixed(2)}`;
}

export default function CakeCard({ cake }) {
  return (
    <Link
      to={`/cakes/${cake.id}`}
      className="group bg-white rounded-2xl border border-stroke overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-200"
    >
      {/* Image */}
      <div className="aspect-4/3 bg-muted overflow-hidden">
        {cake.imageUrl ? (
          <img
            src={cake.imageUrl}
            alt={cake.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              className="text-muted-foreground/30"
            >
              <path d="M12 2C9 2 7 4 7 6v1H5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2V6c0-2-2-4-5-4z" />
              <path d="M9 6c0-1.1.9-2 3-2s3 .9 3 2" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-4">
        {cake.cakeTypeName && (
          <p className="text-[11px] font-semibold text-teal uppercase tracking-wider mb-1">
            {cake.cakeTypeName}
          </p>
        )}
        <h3 className="font-heading text-lg text-brown leading-snug mb-2">
          {cake.name}
        </h3>

        {cake.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-1">
            {cake.description}
          </p>
        )}

        {/* Decoration tags */}
        {cake.decorationNames?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {cake.decorationNames.slice(0, 3).map((d) => (
              <span
                key={d}
                className="text-[11px] bg-peach text-brown px-2 py-0.5 rounded-full"
              >
                {d}
              </span>
            ))}
            {cake.decorationNames.length > 3 && (
              <span className="text-[11px] bg-peach text-brown px-2 py-0.5 rounded-full">
                +{cake.decorationNames.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Price + CTA */}
        <div className="mt-auto pt-3 border-t border-stroke flex items-center justify-between">
          <span className="font-heading text-xl text-crimson">
            {formatPrice(cake.price)}
          </span>
          <span className="text-xs font-semibold text-crimson group-hover:underline transition-all">
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}
