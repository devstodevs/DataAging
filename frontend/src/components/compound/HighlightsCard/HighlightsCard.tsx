import React from "react";
import { Bell } from "lucide-react";
import Card from "../../base/Card/Card";

interface Highlight {
    type: string;
    description: string;
}

interface HighlightsCardProps {
    highlights: Highlight[];
}

const HighlightsCard: React.FC<HighlightsCardProps> = ({ highlights }) => {
    return (
        <Card maxWidth="100%" className="max-w-2xl">
            {/* Título da Seção */}
            <div className="flex items-center space-x-2 mb-6">
                <Bell className="w-5 h-5 text-black-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                    Destaques
                </h2>
            </div>

            {/* Lista de Destaques */}
            <div className="space-y-4">
                {highlights.map((highlight, index) => (
                    <div key={index}>
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium text-gray-900">
                                {highlight.type}
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {highlight.description}
                            </p>
                        </div>

                        {/* Linha divisória (não mostrar na última item) */}
                        {index < highlights.length - 1 && (
                            <hr className="mt-4 border-gray-200" />
                        )}
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default HighlightsCard;