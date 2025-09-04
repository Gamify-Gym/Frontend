
export type Food = {
  id_food: number;
  name_food: string;
  calories: number;
  proteins: number;
  carbohydrates: number;
  fats: number;
  fibers: number;
  sodium: number;
  sugars: {
    id_sugar: number;
    total_sugar: number;
    added_sugar: number;
  };
  fats_detail: {
    id_fat: number;
    trans_fats: number;
    monounsaturated_fats: number;
    polyunsaturated_fats: number;
    satured_fats: number;
  };
};

export type Meal = {
  id_meal: number;
  name_meal: string;
  order_meal: number;
};

export type DietItem = {
  id_diet_item: number;
  grams: number;
  diet_plan_id: number;
  food: Food;
  meal: Meal;
};

export type DietPlan = {
  id_diet_plan: number;
  name_diet: string;
  description: string;
  player_id: number;
  nutritionist_id?: number;
  items: DietItem[];
};

export const fakeDietData: DietPlan = {
  id_diet_plan: 1,
  name_diet: "Dieta Hipocalórica",
  description: "Plano focado em redução calórica para perda de peso",
  player_id: 101,
  nutritionist_id: 10,
  items: [
    {
      id_diet_item: 1,
      grams: 150,
      diet_plan_id: 1,
      food: {
        id_food: 1,
        name_food: "Peito de Frango",
        calories: 165,
        proteins: 31,
        carbohydrates: 0,
        fats: 3.6,
        fibers: 0,
        sodium: 74,
        sugars: {
          id_sugar: 1,
          total_sugar: 0,
          added_sugar: 0,
        },
        fats_detail: {
          id_fat: 1,
          trans_fats: 0,
          monounsaturated_fats: 1.2,
          polyunsaturated_fats: 0.8,
          satured_fats: 1.1,
        },
      },
      meal: {
        id_meal: 1,
        name_meal: "Almoço",
        order_meal: 2,
      },
    },
    {
      id_diet_item: 2,
      grams: 100,
      diet_plan_id: 1,
      food: {
        id_food: 2,
        name_food: "Arroz Integral",
        calories: 111,
        proteins: 2.6,
        carbohydrates: 23,
        fats: 0.9,
        fibers: 1.8,
        sodium: 5,
        sugars: {
          id_sugar: 2,
          total_sugar: 0.4,
          added_sugar: 0,
        },
        fats_detail: {
          id_fat: 2,
          trans_fats: 0,
          monounsaturated_fats: 0.3,
          polyunsaturated_fats: 0.4,
          satured_fats: 0.1,
        },
      },
      meal: {
        id_meal: 1,
        name_meal: "Almoço",
        order_meal: 2,
      },
    },
    {
      id_diet_item: 3,
      grams: 50,
      diet_plan_id: 1,
      food: {
        id_food: 3,
        name_food: "Brócolis",
        calories: 34,
        proteins: 2.8,
        carbohydrates: 7,
        fats: 0.4,
        fibers: 2.6,
        sodium: 33,
        sugars: {
          id_sugar: 3,
          total_sugar: 1.7,
          added_sugar: 0,
        },
        fats_detail: {
          id_fat: 3,
          trans_fats: 0,
          monounsaturated_fats: 0.1,
          polyunsaturated_fats: 0.2,
          satured_fats: 0.05,
        },
      },
      meal: {
        id_meal: 2,
        name_meal: "Jantar",
        order_meal: 3,
      },
    },
  ],
};
