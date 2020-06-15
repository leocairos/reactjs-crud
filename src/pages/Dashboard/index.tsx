import React, { useState, useEffect, useCallback } from 'react';

import Header from '../../components/Header';

import api from '../../services/api';

import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';

import { FoodsContainer } from './styles';

interface IFoodPlate {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

const Dashboard: React.FC = () => {
  const [foods, setFoods] = useState<IFoodPlate[]>([]);
  const [editingFood, setEditingFood] = useState<IFoodPlate>({} as IFoodPlate);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function loadFoods(): Promise<void> {
      // TODO LOAD FOODS
      const { data } = await api.get('/foods');
      setFoods(data);
    }

    loadFoods();
  }, []);

  const handleAddFood = useCallback(
    async (food: Omit<IFoodPlate, 'id' | 'available'>) => {
      // TODO ADD FOODS
      try {
        const { data } = await api.post('/foods', { ...food, available: true });

        setFoods(oldFoods => [...oldFoods, data]);
      } catch (err) {
        console.log(err);
      }
    },
    [],
  );

  const handleUpdateFood = useCallback(
    async (food: Omit<IFoodPlate, 'id' | 'available'>) => {
      try {
        // TODO UPDATE A FOOD PLATE ON THE API
        const { data } = await api.put<IFoodPlate>(`/foods/${editingFood.id}`, {
          ...food,
          id: editingFood.id,
          available: editingFood.available,
        });

        const updatedFoods = foods.map(foodToMap =>
          foodToMap.id === data.id ? data : foodToMap,
        );

        setFoods(updatedFoods);
      } catch (err) {
        console.log(err);
      }
    },
    [editingFood.available, editingFood.id, foods],
  );

  const handleDeleteFood = useCallback(async (id: number) => {
    try {
      // TODO DELETE A FOOD PLATE FROM THE API
      await api.delete(`/foods/${id}`);

      setFoods(oldFoods => oldFoods.filter(food => food.id !== id));
    } catch (err) {
      console.log(err);
    }
  }, []);

  function toggleModal(): void {
    setModalOpen(!modalOpen);
  }

  const toggleEditModal = useCallback(() => {
    setEditModalOpen(!editModalOpen);
  }, [editModalOpen]);

  const handleEditFood = useCallback(
    (food: IFoodPlate) => {
      // TODO SET THE CURRENT EDITING FOOD ID IN THE STATE
      setEditingFood(food);
      toggleEditModal();
    },
    [toggleEditModal],
  );

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
