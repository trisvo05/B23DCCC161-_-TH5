import {Subject} from "./typing";

export const getSubjects = (): Subject[] => {
    return JSON.parse(localStorage.getItem("subjects")!);
};

export const saveSubjects = (subjects: Subject[]) => {
    localStorage.setItem("subjects", JSON.stringify(subjects));
};

export const addSubject = (subject: Subject): Subject[] => {
	const subjects = getSubjects();
	const updatedSubjects = [...subjects, subject];
	saveSubjects(updatedSubjects);
	return updatedSubjects;
};

export const editSubject = (id: string, updatedSubjects: Partial<Subject>): Subject[] => {
    const subjects = getSubjects();
    const index = subjects.findIndex(subject => subject.id === id);

    if (index!== -1) {
        subjects[index] = {...subjects[index], ...updatedSubjects};
        saveSubjects(subjects);
    }
    return subjects;
}

export const deleteSubject = (id: string): Subject[] => {
    const subjects = getSubjects();
    const updatedSubjects = subjects.filter(subject => subject.id !== id);

    saveSubjects(updatedSubjects);
    return updatedSubjects;
}

