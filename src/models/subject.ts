import { useState, useEffect } from "react";
import { getSubjects, addSubject, editSubject, deleteSubject } from "@/services/Question";
import { Subject, KnowledgeBlock } from "@/services/Question/typing";

export default () => {
    const [subjects, setSubjects] = useState<Subject[]>([]);

    useEffect(() => {
        setSubjects(getSubjects());
    }, []);

    const handleAddSubject = (
        subjectId: string,
        name: string,
        credits: number,
        knowledgeBlockNames: string[]
    ) => {
        const subjectIdGenerated = Date.now().toString();
    
        const knowledgeBlocks: KnowledgeBlock[] = knowledgeBlockNames.map((blockName, index) => ({
            id: `${Date.now()}-${index}`,
            name: blockName,
        }));
    
        const newSubject: Subject = {
            id: subjectIdGenerated,
            subjectId,
            name,
            credits,
            knowledgeBlocks,
        };
    
        const updatedSubjects = addSubject(newSubject);
        setSubjects(updatedSubjects);
    };
    
    const handleEditSubject = (id: string, updatedSubjects: Partial<Subject>) => {
        setSubjects(editSubject(id, updatedSubjects));
    }

    const handleDeleteSubject = (id: string) => {
        setSubjects(deleteSubject(id));
    }

    return {
        subjects,
        handleAddSubject,
        handleDeleteSubject,
        handleEditSubject,
    };
};

