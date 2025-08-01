import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { ChevronLeft, ChevronRight, Plus, Clock, Users, Calendar } from 'lucide-react-native';

// Sample meal data
const sampleMeals = {
  '2024-01-15': [
    { id: 1, name: 'Avocado Toast', time: '8:00 AM', type: 'breakfast', servings: 2, color: 'bg-green-500' },
    { id: 2, name: 'Grilled Chicken Salad', time: '12:30 PM', type: 'lunch', servings: 4, color: 'bg-blue-500' },
    { id: 3, name: 'Spaghetti Bolognese', time: '7:00 PM', type: 'dinner', servings: 4, color: 'bg-orange-500' },
  ],
  '2024-01-16': [
    { id: 4, name: 'Greek Yogurt Bowl', time: '8:30 AM', type: 'breakfast', servings: 1, color: 'bg-green-500' },
    { id: 5, name: 'Turkey Sandwich', time: '1:00 PM', type: 'lunch', servings: 2, color: 'bg-blue-500' },
    { id: 6, name: 'Salmon with Rice', time: '6:30 PM', type: 'dinner', servings: 3, color: 'bg-orange-500' },
  ],
  '2024-01-17': [
    { id: 7, name: 'Pancakes', time: '9:00 AM', type: 'breakfast', servings: 3, color: 'bg-green-500' },
    { id: 8, name: 'Caesar Salad', time: '12:00 PM', type: 'lunch', servings: 2, color: 'bg-blue-500' },
  ],
  '2024-01-18': [
    { id: 9, name: 'Smoothie Bowl', time: '8:15 AM', type: 'breakfast', servings: 1, color: 'bg-green-500' },
    { id: 10, name: 'Chicken Wrap', time: '1:15 PM', type: 'lunch', servings: 2, color: 'bg-blue-500' },
    { id: 11, name: 'Beef Stir Fry', time: '7:30 PM', type: 'dinner', servings: 4, color: 'bg-orange-500' },
  ],
  '2024-01-19': [
    { id: 12, name: 'Oatmeal', time: '8:00 AM', type: 'breakfast', servings: 2, color: 'bg-green-500' },
    { id: 13, name: 'Quinoa Bowl', time: '12:45 PM', type: 'lunch', servings: 2, color: 'bg-blue-500' },
    { id: 14, name: 'Pizza Night', time: '7:00 PM', type: 'dinner', servings: 6, color: 'bg-orange-500' },
  ],
  '2024-01-20': [
    { id: 15, name: 'French Toast', time: '9:30 AM', type: 'breakfast', servings: 2, color: 'bg-green-500' },
    { id: 16, name: 'Sushi Bowl', time: '1:30 PM', type: 'lunch', servings: 1, color: 'bg-blue-500' },
    { id: 17, name: 'BBQ Ribs', time: '6:00 PM', type: 'dinner', servings: 4, color: 'bg-orange-500' },
  ],
  '2024-01-21': [
    { id: 18, name: 'Breakfast Burrito', time: '10:00 AM', type: 'breakfast', servings: 3, color: 'bg-green-500' },
    { id: 19, name: 'Poke Bowl', time: '2:00 PM', type: 'lunch', servings: 2, color: 'bg-blue-500' },
    { id: 20, name: 'Pasta Primavera', time: '7:15 PM', type: 'dinner', servings: 4, color: 'bg-orange-500' },
  ],
};

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const weekDates = ['15', '16', '17', '18', '19', '20', '21'];

const TimelineMeal = ({ meal, isLast = false }) => (
  <View className="flex-row items-center mb-6">
    {/* Timeline bubble and line */}
    <View className="items-center mr-4">
      <View className={`w-4 h-4 ${meal.color} rounded-full border-2 border-white shadow-md`} />
      {!isLast && <View className="w-0.5 h-12 bg-gray-300 mt-2" />}
    </View>

    {/* Meal content */}
    <TouchableOpacity className="flex-1 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      <View className="flex-row items-start justify-between mb-2">
        <Text className="font-semibold text-gray-800 text-base flex-1 mr-2">{meal.name}</Text>
        <View className="flex-row items-center">
          <Clock size={12} color="#6B7280" />
          <Text className="text-xs text-gray-600 ml-1">{meal.time}</Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className={`w-2 h-2 ${meal.color} rounded-full mr-2`} />
          <Text className="text-sm text-gray-600 capitalize">{meal.type}</Text>
        </View>
        <View className="flex-row items-center">
          <Users size={12} color="#6B7280" />
          <Text className="text-xs text-gray-600 ml-1">{meal.servings} servings</Text>
        </View>
      </View>
    </TouchableOpacity>
  </View>
);

const TimelineDayHeader = ({ day, date, isToday = false }) => (
  <View className="flex-row items-center mb-6">
    {/* Timeline marker for day */}
    <View className="items-center mr-4">
      <View className={`w-6 h-6 ${isToday ? 'bg-blue-500' : 'bg-gray-400'} rounded-full border-2 border-white shadow-md items-center justify-center`}>
        <Calendar size={12} color="white" />
      </View>
      <View className="w-0.5 h-6 bg-gray-300 mt-2" />
    </View>

    {/* Day header content */}
    <View className={`flex-1 ${isToday ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'} rounded-lg p-3 border`}>
      <View className="flex-row items-center justify-between">
        <View>
          <Text className={`text-lg font-bold ${isToday ? 'text-blue-800' : 'text-gray-800'}`}>
            {day}
          </Text>
          <Text className={`text-sm ${isToday ? 'text-blue-600' : 'text-gray-600'}`}>
            January {date}, 2024
          </Text>
        </View>
        {isToday && (
          <View className="bg-blue-500 rounded-full px-3 py-1">
            <Text className="text-white text-xs font-semibold">TODAY</Text>
          </View>
        )}
      </View>
    </View>
  </View>
);

const AddMealButton = ({ isLast = false }) => (
  <View className="flex-row items-center mb-6">
    <View className="items-center mr-4">
      <TouchableOpacity className="w-4 h-4 border-2 border-dashed border-gray-400 rounded-full items-center justify-center">
        <Plus size={8} color="#9CA3AF" />
      </TouchableOpacity>
      {!isLast && <View className="w-0.5 h-12 bg-gray-300 mt-2" />}
    </View>

    <TouchableOpacity className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-4 items-center justify-center bg-gray-50">
      <Text className="text-sm text-gray-500 font-medium">Add Meal</Text>
    </TouchableOpacity>
  </View>
);

export default function MealPlanCalendar() {
  const [currentWeek, setCurrentWeek] = useState('Jan 15 - 21, 2024');

  // Create timeline items
  const timelineItems = [];
  daysOfWeek.forEach((day, dayIndex) => {
    const dateKey = `2024-01-${weekDates[dayIndex]}`;
    const meals = sampleMeals[dateKey] || [];
    const isToday = dayIndex === 2; // Wednesday is "today" for demo

    // Add day header
    timelineItems.push({
      type: 'day',
      day,
      date: weekDates[dayIndex],
      isToday,
      key: `day-${dayIndex}`
    });

    // Add meals for this day
    meals.forEach((meal, mealIndex) => {
      timelineItems.push({
        type: 'meal',
        meal,
        key: `meal-${meal.id}`,
        isLastMealOfDay: mealIndex === meals.length - 1,
        isLastDay: dayIndex === daysOfWeek.length - 1
      });
    });

    // Add "add meal" button for each day
    timelineItems.push({
      type: 'addMeal',
      key: `add-${dayIndex}`,
      isLastDay: dayIndex === daysOfWeek.length - 1
    });
  });

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white shadow-sm border-b border-gray-200 px-4 py-4">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity className="p-2 -ml-2">
            <ChevronLeft size={24} color="#374151" />
          </TouchableOpacity>

          <View className="flex-1 items-center">
            <Text className="text-xl font-bold text-gray-800">Meal Timeline</Text>
            <Text className="text-sm text-gray-600 mt-1">{currentWeek}</Text>
          </View>

          <TouchableOpacity className="p-2 -mr-2">
            <ChevronRight size={24} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Timeline */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      >
        {/* Timeline container with left margin for the line */}
        <View className="relative">
          {/* Main timeline line */}
          <View className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-300" />

          {/* Timeline items */}
          {timelineItems.map((item, index) => {
            const isLast = index === timelineItems.length - 1;

            if (item.type === 'day') {
              return (
                <TimelineDayHeader
                  key={item.key}
                  day={item.day}
                  date={item.date}
                  isToday={item.isToday}
                />
              );
            } else if (item.type === 'meal') {
              return (
                <TimelineMeal
                  key={item.key}
                  meal={item.meal}
                  isLast={isLast}
                />
              );
            } else if (item.type === 'addMeal') {
              return (
                <AddMealButton
                  key={item.key}
                  isLast={isLast}
                />
              );
            }
            return null;
          })}
        </View>
        
        {/* Bottom Stats */}
        <View className="bg-white border-t border-gray-200 px-4 py-4">
          <View className="flex-row justify-around">
            <View className="items-center">
              <Text className="text-xl font-bold text-green-600">7</Text>
              <Text className="text-xs text-gray-600 mt-1">Breakfasts</Text>
            </View>
            <View className="items-center">
              <Text className="text-xl font-bold text-blue-600">7</Text>
              <Text className="text-xs text-gray-600 mt-1">Lunches</Text>
            </View>
            <View className="items-center">
              <Text className="text-xl font-bold text-orange-600">6</Text>
              <Text className="text-xs text-gray-600 mt-1">Dinners</Text>
            </View>
            <View className="items-center">
              <Text className="text-xl font-bold text-purple-600">20</Text>
              <Text className="text-xs text-gray-600 mt-1">Total Meals</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}