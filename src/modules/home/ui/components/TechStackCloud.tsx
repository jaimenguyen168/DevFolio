import { TagCloud } from "react-tagcloud";
import { Project } from "@/modules/types";
import { getTechStackCounts } from "@/modules/projects/lib/techStacks";

interface TechStackCloudProps {
  projects: Project[] | undefined;
}

const TechStackCloud = ({ projects }: TechStackCloudProps) => {
  if (projects === undefined) {
    return (
      <div className="mt-8 mb-8">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-300">
          // my techStacks
        </h2>
        <div className="w-full py-8 flex justify-center">
          <div className="animate-pulse text-gray-500">
            Loading technologies...
          </div>
        </div>
      </div>
    );
  }

  if (
    !projects ||
    projects.length === 0 ||
    !projects.some((p) => p.techStack && p.techStack.length > 0)
  ) {
    return null;
  }

  const techData = getTechStackCounts(projects);

  if (techData.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 mb-8">
      <h2 className="text-2xl font-bold text-center mb-4 text-gray-300">
        // my techStacks
      </h2>
      <div className="w-full py-8">
        <TagCloud
          minSize={14}
          maxSize={40}
          tags={techData}
          className="text-center"
          disableRandomColor={true}
          onClick={(tag) => {
            console.log(`${tag.value}: ${tag.count} projects`);
          }}
          renderer={(tag, size) => {
            // Color based on popularity
            let tagColor;
            if (tag.count >= 5) {
              tagColor = "#fb923c"; // orange for most popular
            } else if (tag.count >= 3) {
              tagColor = "#818cf8"; // indigo for medium
            } else {
              tagColor = "#60a5fa"; // blue for less popular
            }

            return (
              <span
                key={tag.value}
                style={{
                  fontSize: `${size}px`,
                  margin: "8px",
                  padding: "4px 8px",
                  display: "inline-block",
                  color: tagColor,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                className="hover:text-orange-400 hover:scale-110"
              >
                {tag.value} ({tag.count})
              </span>
            );
          }}
        />
      </div>
    </div>
  );
};

export default TechStackCloud;
