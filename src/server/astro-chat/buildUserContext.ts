export type UserLifeStage =
  | "child"
  | "student"
  | "early_career"
  | "mid_career"
  | "late_career";

export type UserCareerStage =
  | "pre_education"
  | "education"
  | "entry_level"
  | "experienced"
  | "senior";

export type UserAdviceStyle =
  | "development"
  | "education"
  | "career_growth"
  | "leadership"
  | "legacy";

export type SarathiUserContext = {
  age: number | null;
  lifeStage: UserLifeStage | null;
  careerStage: UserCareerStage | null;
  adviceStyle: UserAdviceStyle | null;
};

function calculateAge(
  dateISO?: string | null
): number | null {
  if (!dateISO) return null;

  const birthDate =
    new Date(`${dateISO}T00:00:00`);

  if (
    Number.isNaN(
      birthDate.getTime()
    )
  ) {
    return null;
  }

  const today =
    new Date();

  let age =
    today.getFullYear() -
    birthDate.getFullYear();

  const monthDiff =
    today.getMonth() -
    birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (
      monthDiff === 0 &&
      today.getDate() <
        birthDate.getDate()
    )
  ) {
    age -= 1;
  }

  return Math.max(
    0,
    age
  );
}

export function buildUserContext(
  dateISO?: string | null
): SarathiUserContext {
  const age =
    calculateAge(
      dateISO
    );

  if (age === null) {
    return {
      age: null,
      lifeStage: null,
      careerStage: null,
      adviceStyle: null,
    };
  }

  if (age <= 12) {
    return {
      age,
      lifeStage: "child",
      careerStage: "pre_education",
      adviceStyle: "development",
    };
  }

  if (age <= 22) {
    return {
      age,
      lifeStage: "student",
      careerStage: "education",
      adviceStyle: "education",
    };
  }

  if (age <= 35) {
    return {
      age,
      lifeStage: "early_career",
      careerStage: "entry_level",
      adviceStyle: "career_growth",
    };
  }

  if (age <= 55) {
    return {
      age,
      lifeStage: "mid_career",
      careerStage: "experienced",
      adviceStyle: "leadership",
    };
  }

  return {
    age,
    lifeStage: "late_career",
    careerStage: "senior",
    adviceStyle: "legacy",
  };
}