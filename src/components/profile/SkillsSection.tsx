
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Skill {
  id: string;
  name: string;
  category: string;
}

interface SkillsSectionProps {
  userId: string;
  initialSkills?: Skill[];
}

export const SkillsSection = ({ userId, initialSkills = [] }: SkillsSectionProps) => {
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [newSkill, setNewSkill] = useState("");
  const { toast } = useToast();

  const addSkill = async () => {
    if (!newSkill.trim()) return;

    try {
      // First, check if the skill exists
      let { data: existingSkill } = await supabase
        .from('skills')
        .select('*')
        .ilike('name', newSkill.trim())
        .single();

      let skillId;

      if (!existingSkill) {
        // Create new skill if it doesn't exist
        const { data: newSkillData, error: skillError } = await supabase
          .from('skills')
          .insert({
            name: newSkill.trim(),
            category: 'general' // Default category
          })
          .select()
          .single();

        if (skillError) throw skillError;
        skillId = newSkillData.id;
      } else {
        skillId = existingSkill.id;
      }

      // Add skill to user_skills
      const { error: linkError } = await supabase
        .from('user_skills')
        .insert({
          user_id: userId,
          skill_id: skillId
        });

      if (linkError) throw linkError;

      setSkills([...skills, { id: skillId, name: newSkill.trim(), category: 'general' }]);
      setNewSkill("");
      
      toast({
        title: "Skill added",
        description: `${newSkill} has been added to your profile.`
      });
    } catch (error) {
      console.error('Error adding skill:', error);
      toast({
        title: "Error",
        description: "Failed to add skill. Please try again.",
        variant: "destructive"
      });
    }
  };

  const removeSkill = async (skillId: string) => {
    try {
      const { error } = await supabase
        .from('user_skills')
        .delete()
        .eq('user_id', userId)
        .eq('skill_id', skillId);

      if (error) throw error;

      setSkills(skills.filter(skill => skill.id !== skillId));
      
      toast({
        title: "Skill removed",
        description: "The skill has been removed from your profile."
      });
    } catch (error) {
      console.error('Error removing skill:', error);
      toast({
        title: "Error",
        description: "Failed to remove skill. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Add a new skill..."
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addSkill()}
        />
        <Button onClick={addSkill}>Add</Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <Badge key={skill.id} variant="secondary" className="flex items-center gap-1">
            {skill.name}
            <button
              onClick={() => removeSkill(skill.id)}
              className="ml-1 hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
};
