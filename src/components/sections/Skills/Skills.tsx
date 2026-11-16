import { Cluster, Grid } from "@/components/ui/Layout";
import { SkillTag } from "@/components/ui/SkillTag";
import { skillGroups } from "@/content/skills";

import styles from "./Skills.module.css";

/** Skills em grupos: 1 coluna no celular, 2 no tablet e 3 no desktop. */
export function Skills() {
  return (
    <Grid as="ul" columns={{ base: 1, tablet: 2, desktop: 3 }} gap={{ base: 20, desktop: 40 }}>
      {skillGroups.map((group) => (
        <li key={group.title} className={styles.group}>
          <h3 className={styles.title}>{group.title}</h3>
          <Cluster as="ul" gap={{ base: 6, desktop: 8 }}>
            {group.skills.map((skill) => (
              <li key={skill.name}>
                <SkillTag
                  label={skill.name}
                  {...("brand" in skill ? { brand: skill.brand } : {})}
                />
              </li>
            ))}
          </Cluster>
        </li>
      ))}
    </Grid>
  );
}
