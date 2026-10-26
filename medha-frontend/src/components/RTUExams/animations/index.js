/**
 * Animation Registry
 * Central export for all concept animations
 * Each animation file exports metadata and AnimationSteps array
 */

// Import animations as they are created
import * as HalfAdderAnimation from './HalfAdderAnimation';
import * as CppTemplatesAnimation from './CppTemplatesAnimation';
import * as Unit5OneShotAnimation from './Unit5OneShotAnimation';
import * as Unit4OneShotAnimation from './Unit4OneShotAnimation';
import * as Unit3OneShotAnimation from './Unit3OneShotAnimation';
import * as Unit2OneShotAnimation from './Unit2OneShotAnimation';
import * as Unit1OneShotAnimation from './Unit1OneShotAnimation';
import * as VirtualFunctionsOneShotAnimation from './VirtualFunctionsOneShotAnimation';
import * as VirtualFunctionsLectureAnimation from './VirtualFunctionsLectureAnimation';
import * as OperatorOverloadingLectureAnimation from './OperatorOverloadingLectureAnimation';
import * as CppReferencesLectureAnimation from './CppReferencesLectureAnimation';
import * as ThisPointerLectureAnimation from './ThisPointerLectureAnimation';
import * as VersatileFunctionsLectureAnimation from './VersatileFunctionsLectureAnimation';
import * as InheritanceLectureAnimation from './InheritanceLectureAnimation';
import * as OopIntroLectureAnimation from './OopIntroLectureAnimation';
import * as RuntimePolymorphismLectureAnimation from './RuntimePolymorphismLectureAnimation';
import * as MultipleInheritanceLectureAnimation from './MultipleInheritanceLectureAnimation';
import * as AbstractClassLectureAnimation from './AbstractClassLectureAnimation';
import * as OopFeaturesLectureAnimation from './OopFeaturesLectureAnimation';
import * as ClassesObjectsLectureAnimation from './ClassesObjectsLectureAnimation';
import * as AccessSpecifiersLectureAnimation from './AccessSpecifiersLectureAnimation';
import * as ConstructorLectureAnimation from './ConstructorLectureAnimation';
// import * as FullAdderAnimation from './FullAdderAnimation';
// Add more imports as animations are created

// Registry of all available animations
// Maps animationId to the animation module
const animationRegistry = {
  'half-adder': HalfAdderAnimation,
  'cpp-templates': CppTemplatesAnimation,
  'unit5-oneshot': Unit5OneShotAnimation,
  'unit4-oneshot': Unit4OneShotAnimation,
  'unit3-oneshot': Unit3OneShotAnimation,
  'unit2-oneshot': Unit2OneShotAnimation,
  'unit1-oneshot': Unit1OneShotAnimation,
  'virtual-functions': VirtualFunctionsOneShotAnimation,
  'virtual-functions-lecture': VirtualFunctionsLectureAnimation,
  'operator-overloading-lecture': OperatorOverloadingLectureAnimation,
  'cpp-references-lecture': CppReferencesLectureAnimation,
  'this-pointer-lecture': ThisPointerLectureAnimation,
  'versatile-functions-lecture': VersatileFunctionsLectureAnimation,
  'inheritance-lecture': InheritanceLectureAnimation,
  'oop-intro-lecture': OopIntroLectureAnimation,
  'runtime-polymorphism-lecture': RuntimePolymorphismLectureAnimation,
  'multiple-inheritance-lecture': MultipleInheritanceLectureAnimation,
  'abstract-class-lecture': AbstractClassLectureAnimation,
  'oop-features-lecture': OopFeaturesLectureAnimation,
  'classes-objects-lecture': ClassesObjectsLectureAnimation,
  'access-specifiers-lecture': AccessSpecifiersLectureAnimation,
  'constructor-lecture': ConstructorLectureAnimation,
  // 'full-adder': FullAdderAnimation,
  // Add more animations here
};

/**
 * Get animation by ID
 * @param {string} animationId - The unique animation identifier
 * @returns {Object|null} Animation module with metadata and steps
 */
export const getAnimation = (animationId) => {
  return animationRegistry[animationId] || null;
};

/**
 * Get list of all available animations
 * @returns {Array} Array of animation metadata objects
 */
export const getAllAnimations = () => {
  return Object.entries(animationRegistry).map(([id, module]) => ({
    id,
    ...module.metadata
  }));
};

/**
 * Check if an animation exists
 * @param {string} animationId - The unique animation identifier
 * @returns {boolean}
 */
export const hasAnimation = (animationId) => {
  return animationId in animationRegistry;
};

export default animationRegistry;
